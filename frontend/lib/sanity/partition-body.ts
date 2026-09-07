import type { TypedObject } from '@portabletext/types';

type PortableTextBlockLike = TypedObject & {
  style?: string;
  listItem?: string;
  _type?: string;
};

function isSafeSplitIndex(body: PortableTextBlockLike[], k: number): boolean {
  if (k <= 0 || k >= body.length) return false;

  const prev = body[k - 1];
  const curr = body[k];

  // Never split inside an ongoing list sequence (between two list items)
  if (prev?.listItem && curr?.listItem) {
    return false;
  }

  // Avoid splitting right before a heading
  if (curr?.style === 'h2' || curr?.style === 'h3' || curr?.style === 'h4') {
    return false;
  }

  // Avoid splitting right after a heading
  if (prev?.style === 'h2' || prev?.style === 'h3' || prev?.style === 'h4') {
    return false;
  }

  return true;
}

export function partitionBlogBody(body: TypedObject[]): {
  firstChunk: TypedObject[];
  secondChunk: TypedObject[];
  showInlineCTA: boolean;
} {
  const blocks = (Array.isArray(body) ? body : []) as PortableTextBlockLike[];

  // Short articles (< 5 blocks) omit the inline CTA to avoid clutter
  if (blocks.length < 5) {
    return {
      firstChunk: blocks,
      secondChunk: [],
      showInlineCTA: false,
    };
  }

  // Target 35% into reading experience
  const targetIndex = Math.floor(blocks.length * 0.35);

  let bestIndex = -1;
  let minDistance = Infinity;

  for (let k = 1; k < blocks.length - 1; k++) {
    if (isSafeSplitIndex(blocks, k)) {
      const distance = Math.abs(k - targetIndex);

      // Prioritize standard paragraph boundaries
      const isPrevParagraph =
        blocks[k - 1]._type === 'block' && (!blocks[k - 1].style || blocks[k - 1].style === 'normal');
      const score = distance - (isPrevParagraph ? 0.5 : 0);

      if (score < minDistance) {
        minDistance = score;
        bestIndex = k;
      }
    }
  }

  if (bestIndex > 0) {
    return {
      firstChunk: blocks.slice(0, bestIndex),
      secondChunk: blocks.slice(bestIndex),
      showInlineCTA: true,
    };
  }

  return {
    firstChunk: blocks,
    secondChunk: [],
    showInlineCTA: false,
  };
}
