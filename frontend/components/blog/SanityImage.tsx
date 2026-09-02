import Image from 'next/image';
import { buildSanityImageUrl } from '@/lib/sanity/image';
import type { SanityImageValue } from '@/lib/sanity/types';

type SanityImageProps = {
  image: SanityImageValue;
  width: number;
  height?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function SanityImage({
  image,
  width,
  height,
  sizes,
  className,
  priority = false,
}: SanityImageProps) {
  const sourceDimensions = image.asset?.metadata?.dimensions;
  const renderedHeight =
    height ||
    (sourceDimensions?.width && sourceDimensions.height
      ? Math.round((width / sourceDimensions.width) * sourceDimensions.height)
      : Math.round(width * 0.625));
  const src = buildSanityImageUrl(image, {
    width,
    height,
  });

  if (!src) return null;

  const lqip = image.asset?.metadata?.lqip;

  return (
    <Image
      src={src}
      alt={image.alt?.trim() || ''}
      width={width}
      height={renderedHeight}
      sizes={sizes}
      className={className}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
    />
  );
}

