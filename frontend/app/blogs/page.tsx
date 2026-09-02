import type { Metadata } from 'next';
import { BookOpenText } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogCard } from '@/components/blog/BlogCard';
import { getBlogPosts } from '@/lib/sanity/data';
import type { BlogPostCard } from '@/lib/sanity/types';

export const metadata: Metadata = {
  title: 'Solar Energy & Engineering Insights',
  description:
    'Practical insights from E&E Industries on solar energy, engineering, electrical infrastructure, fabrication, contracting and energy efficiency in Pakistan.',
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    type: 'website',
    url: '/blogs',
    title: 'Solar Energy & Engineering Insights',
    description:
      'Practical insights from E&E Industries on solar energy, engineering, electrical infrastructure, fabrication, contracting and energy efficiency in Pakistan.',
  },
};

export default async function BlogsPage() {
  let posts: BlogPostCard[] = [];
  let isUnavailable = false;

  try {
    const response = await getBlogPosts();
    posts = Array.isArray(response) ? response : [];
  } catch (error) {
    isUnavailable = true;
    console.error('Unable to load published Sanity blog posts.', error);
  }

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-x-clip bg-solix-bg text-solix-dark">
      <Header />

      <div>
        <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-36 sm:px-8 sm:pb-16">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex rounded-full border border-solix-border bg-white px-4 py-1 text-xs font-bold uppercase tracking-widest text-solix-green">
              Insights &amp; Knowledge
            </span>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-solix-dark sm:text-5xl lg:text-6xl">
              Insights From E&amp;E Industries
            </h1>
            <p className="max-w-2xl text-base leading-7 text-solix-muted sm:text-lg sm:leading-8">
              Explore practical insights on solar energy, engineering, electrical infrastructure,
              fabrication, contracting and energy efficiency.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="published-insights-heading"
          className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-8"
        >
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-solix-border pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-solix-green">
                E&amp;E Journal
              </p>
              <h2
                id="published-insights-heading"
                className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
              >
                Published Insights
              </h2>
            </div>
            {!isUnavailable && posts.length > 0 && (
              <p className="hidden text-sm text-solix-muted sm:block">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              </p>
            )}
          </div>

          {isUnavailable ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center sm:p-12">
              <BookOpenText className="mx-auto h-10 w-10 text-amber-600" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-extrabold text-solix-dark">
                Insights are temporarily unavailable
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-solix-muted">
                We could not reach the publishing service. Please try this page again shortly.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-solix-border bg-white p-8 text-center shadow-solix sm:p-12">
              <BookOpenText className="mx-auto h-10 w-10 text-solix-green" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-extrabold text-solix-dark">
                New insights are in development
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-solix-muted">
                Our engineering team is preparing practical articles for this knowledge centre.
                Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}

