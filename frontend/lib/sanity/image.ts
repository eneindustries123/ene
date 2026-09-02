import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityConfig } from './env';
import type { SanityImageValue } from './types';

const imageBuilder = createImageUrlBuilder({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
});

type ImageUrlOptions = {
  width: number;
  height?: number;
  quality?: number;
};

export function buildSanityImageUrl(
  source: SanityImageValue | undefined,
  { width, height, quality = 82 }: ImageUrlOptions
): string | null {
  if (!source?.asset) return null;

  try {
    let builder = imageBuilder
      .image(source as SanityImageSource)
      .width(width)
      .quality(quality)
      .auto('format');

    if (height) {
      builder = builder.height(height).fit('crop');
    } else {
      builder = builder.fit('max');
    }

    return builder.url();
  } catch {
    return null;
  }
}

