import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getBlogPosts } from '@/lib/sanity/client';
import { ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Blog & Insights | Solix Renewable Energy',
  description: 'Latest trends, technical analysis, policy updates, and industry insights on solar, wind, and energy storage technologies.',
};

export default async function BlogListingPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            Industry Publications
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Insights, Trends & Expert Advice
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            Stay informed with expert commentary on renewable energy engineering, grid decarbonization economics, and clean tech policy.
          </p>
        </div>
      </section>

      {/* Featured Article Card */}
      {featuredPost && (
        <section className="pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-solix-border shadow-solix grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
            <div className="lg:col-span-6 relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-solix-muted">
                <span className="bg-solix-green text-white px-3 py-1 rounded-full">{featuredPost.category}</span>
                <span>{featuredPost.publishDate}</span>
                <span>• {featuredPost.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-solix-dark group-hover:text-solix-green transition-colors">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-sm text-solix-muted leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 bg-solix-dark text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-black transition-colors"
                >
                  <span>Read Featured Article</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles Grid */}
      <section className="pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-xs font-semibold text-solix-muted">
                  {post.publishDate} • {post.readTime}
                </div>
                <h3 className="text-lg font-bold text-solix-dark group-hover:text-solix-green transition-colors leading-snug line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-xs text-solix-muted leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-solix-border/50">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block text-xs font-bold text-solix-dark hover:text-solix-green"
                >
                  Read Article →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
