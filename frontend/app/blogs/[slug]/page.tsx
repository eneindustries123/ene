import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogPortableText } from '@/components/blog/BlogPortableText';
import { SanityImage } from '@/components/blog/SanityImage';
import { getBlogPostBySlug } from '@/lib/sanity/data';
import { buildSanityImageUrl } from '@/lib/sanity/image';
import { calculateReadingTime } from '@/lib/sanity/reading-time';
import { absoluteSiteUrl } from '@/lib/site';
import type { BlogPost } from '@/lib/sanity/types';

type BlogPageProps = {
  params: { slug: string };
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const getPost = cache((slug: string) => getBlogPostBySlug(slug));
const dateFormatter = new Intl.DateTimeFormat('en-PK', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Karachi',
});

function isValidSlug(slug: string): boolean {
  return slug.length <= 96 && SLUG_PATTERN.test(slug);
}

function getCanonicalUrl(post: BlogPost): string {
  return post.canonicalUrl?.trim() || absoluteSiteUrl(`/blogs/${post.slug}`);
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  if (!isValidSlug(params.slug)) {
    return { title: 'Article Not Found', robots: { index: false, follow: true } };
  }

  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Article Not Found', robots: { index: false, follow: true } };
  }

  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.excerpt;
  const canonical = getCanonicalUrl(post);
  const socialImage = post.ogImage?.asset ? post.ogImage : post.featuredImage;
  const socialImageUrl = buildSanityImageUrl(socialImage, {
    width: 1200,
    height: 630,
    quality: 86,
  });
  const images = socialImageUrl
    ? [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: socialImage?.alt?.trim() || '',
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    robots: {
      index: post.noIndex !== true,
      follow: true,
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImageUrl ? [socialImageUrl] : undefined,
    },
  };
}

function serializeJsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildBlogPostingJsonLd(post: BlogPost) {
  const canonical = getCanonicalUrl(post);
  const imageUrl = buildSanityImageUrl(post.ogImage?.asset ? post.ogImage : post.featuredImage, {
    width: 1200,
    height: 630,
    quality: 86,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription?.trim() || post.excerpt,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    ...(post.author?.name
      ? {
          author: {
            '@type': 'Person',
            name: post.author.name,
          },
        }
      : {}),
    publisher: {
      '@type': 'Organization',
      name: 'E&E Industries',
      logo: {
        '@type': 'ImageObject',
        url: absoluteSiteUrl('/logos/symbol.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  if (!isValidSlug(params.slug)) notFound();

  const post = await getPost(params.slug);
  if (!post || !post.title || !post.excerpt) notFound();

  const readingTime = calculateReadingTime(post.body);
  const jsonLd = buildBlogPostingJsonLd(post);

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-x-clip bg-solix-bg text-solix-dark">
      <Header />

      <article>
        <header className="mx-auto w-full max-w-5xl px-4 pb-10 pt-32 sm:px-8 sm:pb-12 sm:pt-36">
          <Link
            href="/blogs"
            className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-bold text-solix-muted transition-colors hover:text-solix-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-solix-green focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All Insights
          </Link>

          <div className="mt-7 max-w-4xl">
            {post.category?.title && (
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-solix-greenDark">
                {post.category.title}
              </span>
            )}
            <h1 className="text-balance mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-solix-dark sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-solix-muted sm:text-xl">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-solix-border pt-6 text-sm text-solix-muted">
              {post.author?.name && (
                <span className="font-bold text-solix-dark">By {post.author.name}</span>
              )}
              <time dateTime={post.publishedAt}>
                {dateFormatter.format(new Date(post.publishedAt))}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-solix-green" aria-hidden="true" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </header>

        {post.featuredImage?.asset && (
          <figure className="mx-auto w-full max-w-7xl px-4 sm:px-8">
            <div className="overflow-hidden rounded-3xl border border-solix-border bg-solix-dark shadow-solix-lg sm:rounded-4xl">
              <SanityImage
                image={post.featuredImage}
                width={1800}
                height={1013}
                sizes="(max-width: 1280px) 100vw, 1216px"
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            {post.featuredImage.caption && (
              <figcaption className="mt-3 text-center text-sm text-solix-muted">
                {post.featuredImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-8 lg:col-start-3">
            {Array.isArray(post.body) && post.body.length > 0 ? (
              <BlogPortableText value={post.body} />
            ) : (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-solix-muted">
                This article&apos;s content is temporarily unavailable.
              </p>
            )}

            {post.author && (post.author.bio || post.author.role) && (
              <aside className="mt-14 rounded-3xl border border-solix-border bg-white p-6 shadow-solix sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-solix-green">
                  About the author
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-solix-dark">
                  {post.author.name}
                </h2>
                {post.author.role && (
                  <p className="mt-1 text-sm font-semibold text-solix-muted">{post.author.role}</p>
                )}
                {post.author.bio && (
                  <p className="mt-4 text-sm leading-7 text-solix-muted">{post.author.bio}</p>
                )}
              </aside>
            )}
          </div>
        </div>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-8 sm:pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-solix-dark p-8 text-white shadow-solix-dark sm:rounded-4xl sm:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative z-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Engineer your next project
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Turn practical insight into dependable infrastructure.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                Speak with E&amp;E Industries about solar EPC, electrical infrastructure,
                technical procurement, or precision fabrication requirements.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/request-a-quote"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-solix-dark transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Request a Project Estimate
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </article>

      <Footer />
    </main>
  );
}

