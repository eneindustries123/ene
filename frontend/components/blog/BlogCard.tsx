import Link from 'next/link';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { SanityImage } from './SanityImage';
import type { BlogPostCard as BlogPostCardValue } from '@/lib/sanity/types';
import { calculateReadingTime } from '@/lib/sanity/reading-time';

const dateFormatter = new Intl.DateTimeFormat('en-PK', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Karachi',
});

export function BlogCard({ post }: { post: BlogPostCardValue }) {
  const readingTime = calculateReadingTime(post.readingText || '');

  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-solix-border bg-white shadow-solix transition-all duration-300 hover:-translate-y-1 hover:shadow-solix-lg focus-within:ring-2 focus-within:ring-solix-green focus-within:ring-offset-4">
      <Link
        href={`/blogs/${post.slug}`}
        className="flex h-full flex-col focus:outline-none"
        aria-label={`Read article: ${post.title}`}
      >
        <div className="aspect-[16/10] overflow-hidden bg-solix-darkCard">
          {post.featuredImage?.asset ? (
            <SanityImage
              image={post.featuredImage}
              width={900}
              height={563}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-end bg-gradient-to-br from-solix-dark via-solix-darkCard to-solix-greenDark p-6 text-xs font-bold uppercase tracking-widest text-white/70">
              E&amp;E Industries
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
            {post.category?.title && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-solix-greenDark">
                {post.category.title}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-solix-muted">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {readingTime} min read
            </span>
          </div>

          <h2 className="text-xl font-extrabold leading-snug tracking-tight text-solix-dark transition-colors group-hover:text-solix-greenDark sm:text-2xl">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-solix-muted">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-solix-border pt-6 text-xs">
            <div className="min-w-0">
              {post.author?.name && (
                <p className="truncate font-bold text-solix-dark">{post.author.name}</p>
              )}
              <time dateTime={post.publishedAt} className="mt-1 block text-solix-muted">
                {dateFormatter.format(new Date(post.publishedAt))}
              </time>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 font-bold text-solix-greenDark">
              Read Article
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

