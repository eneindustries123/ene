import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getBlogPostBySlug } from '@/lib/sanity/client';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  return {
    title: `${post?.title || 'Article'} | Solix Blog`,
    description: post?.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <article className="pt-36 pb-20 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-solix-muted hover:text-solix-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Insights</span>
          </Link>
        </div>

        {/* Title & Header */}
        <div className="space-y-6 mb-10">
          <div className="inline-block bg-solix-green text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-solix-border text-xs text-solix-muted">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <div className="font-bold text-solix-dark">{post.author.name}</div>
                <div className="text-[11px] text-solix-muted">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.publishDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-solix mb-12 border border-solix-border">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Body Article Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix space-y-6 text-base text-solix-dark leading-relaxed">
          <p className="text-lg font-semibold text-solix-muted leading-relaxed">
            {post.excerpt}
          </p>

          <p>
            As global energy grids undergo unprecedented structural transformation, commercial and industrial facility operators face mounting pressure to balance power resilience with strict corporate carbon mandates. Solar photovoltaics and utility-scale wind power have matured from alternative energy options into baseline financial investments.
          </p>

          <h2 className="text-2xl font-bold text-solix-dark pt-4 border-t">
            1. Unlocking Grid Independence with Hybrid Microgrids
          </h2>

          <p>
            By combining high-efficiency monocrystalline solar panels with advanced lithium iron phosphate (LiFePO4) energy storage systems, commercial enterprises can effectively sever reliance on peak-hour utility tariffs. Excess power generated during high irradiance windows is captured and deployed during evening tariff surges or local grid outages.
          </p>

          <h2 className="text-2xl font-bold text-solix-dark pt-4 border-t">
            2. The Long-Term Economics of Clean Asset Management
          </h2>

          <p>
            Modern predictive telemetry platforms enable real-time thermal monitoring across string inverters and individual turbine gearboxes. Identifying efficiency drop-offs or micro-cracks before hardware breakdown ensures continuous operational uptime exceeding 99.8% over a 25-year design lifespan.
          </p>

          <div className="pt-8 border-t flex justify-between items-center">
            <span className="text-xs text-solix-muted">Share this article with your network</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-solix-bg border border-solix-border px-4 py-2 rounded-full text-xs font-bold text-solix-dark hover:bg-solix-border transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
