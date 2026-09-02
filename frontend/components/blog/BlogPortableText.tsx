import Link from 'next/link';
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react';
import type { TypedObject } from '@portabletext/types';
import { BlogTable } from './BlogTable';
import { SanityImage } from './SanityImage';
import type { BlogTable as BlogTableValue, SanityImageValue } from '@/lib/sanity/types';

type LinkMark = TypedObject & {
  _type: 'link';
  href?: string;
  openInNewTab?: boolean;
};

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function isSafeHref(href: string): boolean {
  if (href.startsWith('/') || href.startsWith('#')) return true;

  try {
    return SAFE_PROTOCOLS.has(new URL(href).protocol);
  } catch {
    return false;
  }
}

function PortableTextLink({
  children,
  value,
}: PortableTextMarkComponentProps<LinkMark>) {
  const href = value?.href?.trim();
  if (!href || !isSafeHref(href)) return <>{children}</>;

  const className =
    'font-semibold text-solix-green underline decoration-solix-green/40 underline-offset-4 transition-colors hover:text-solix-greenDark focus:outline-none focus-visible:ring-2 focus-visible:ring-solix-green focus-visible:ring-offset-2';
  const openInNewTab = value?.openInNewTab === true;

  if (href.startsWith('/')) {
    return (
      <Link
        href={href}
        className={className}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="my-5 text-base leading-8 text-solix-text sm:text-[1.0625rem]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 scroll-mt-28 text-2xl font-extrabold tracking-tight text-solix-dark sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-10 scroll-mt-28 text-xl font-extrabold tracking-tight text-solix-dark sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-8 scroll-mt-28 text-lg font-bold text-solix-dark sm:text-xl">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 rounded-r-2xl border-l-4 border-solix-green bg-emerald-50 px-6 py-4 text-lg font-medium italic leading-8 text-solix-dark">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => (
      <span className="underline decoration-2 underline-offset-2">{children}</span>
    ),
    link: PortableTextLink,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc space-y-2 marker:text-solix-green">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal space-y-2 marker:font-bold marker:text-solix-green">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1 leading-8 text-solix-text">{children}</li>,
    number: ({ children }) => <li className="pl-1 leading-8 text-solix-text">{children}</li>,
  },
  types: {
    articleImage: ({ value }) => {
      const image = value as SanityImageValue;
      if (!image.asset) return null;

      return (
        <figure className="my-10">
          <div className="overflow-hidden rounded-2xl border border-solix-border bg-solix-card shadow-solix">
            <SanityImage
              image={image}
              width={1400}
              sizes="(max-width: 768px) 100vw, 800px"
              className="h-auto w-full object-cover"
            />
          </div>
          {image.caption && (
            <figcaption className="mt-3 text-center text-sm leading-relaxed text-solix-muted">
              {image.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    table: ({ value }) => <BlogTable value={value as BlogTableValue} />,
  },
};

export function BlogPortableText({ value }: { value: TypedObject[] }) {
  if (!Array.isArray(value) || value.length === 0) return null;

  return <PortableText value={value} components={components} />;
}
