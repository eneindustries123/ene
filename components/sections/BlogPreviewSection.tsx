'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/data';

interface BlogPreviewSectionProps {
  posts: BlogPost[];
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight text-balance">
          Insights, Trends, And Tips From Industry Experts
        </h2>
      </div>

      {/* 3-Column Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              {/* Card Image */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-solix-border/60">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Date */}
              <div className="text-xs font-semibold text-solix-muted">
                {post.publishDate}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-solix-dark group-hover:text-solix-green transition-colors leading-snug line-clamp-2">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
            </div>

            {/* Read More Action */}
            <div className="pt-2">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block px-5 py-2 rounded-full border border-solix-border hover:border-solix-dark text-solix-dark hover:bg-solix-dark hover:text-white text-xs font-bold transition-all"
              >
                Read more
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
