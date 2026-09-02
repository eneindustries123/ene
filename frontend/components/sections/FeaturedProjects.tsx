'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { HOMEPAGE_FEATURED_PROJECTS, HomepageShowcaseProject } from '@/lib/data';

interface FeaturedProjectsProps {
  projects?: HomepageShowcaseProject[];
}

export function FeaturedProjects({ projects = HOMEPAGE_FEATURED_PROJECTS }: FeaturedProjectsProps) {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-solix-border pb-8">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-solix-green">
            PROVEN TRACK RECORD
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight">
            Featured Engineering Projects
          </h2>
          <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
            Demonstrated engineering execution across commercial solar EPC, technical procurement, and structural steel fabrication.
          </p>
        </div>

        <Link
          href="/projects"
          className="group inline-flex items-center gap-3 bg-solix-dark hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-full transition-all shadow-md shrink-0"
        >
          <span>View All Projects</span>
          <div className="w-5 h-5 rounded-full bg-white text-solix-dark flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          </div>
        </Link>
      </div>

      {/* 3 Featured Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((proj, idx) => (
          <motion.div
            key={proj.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="bg-white rounded-3xl overflow-hidden border border-solix-border shadow-solix hover:shadow-solix-lg transition-all group flex flex-col justify-between"
          >
            <Link
              href={proj.href}
              className="flex flex-col h-full justify-between focus:outline-none focus:ring-2 focus:ring-solix-green/50 rounded-3xl"
            >
              {/* Project Image */}
              <div className="relative w-full h-[240px] overflow-hidden bg-solix-bg">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Project Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <h3 className="text-xl font-extrabold text-solix-dark group-hover:text-solix-green transition-colors leading-snug">
                  {proj.title}
                </h3>

                <div className="pt-4 border-t border-solix-border/50 flex items-center justify-between text-xs font-bold text-solix-dark group-hover:text-solix-green transition-colors">
                  <span>Explore Project Case Study</span>
                  <div className="w-6 h-6 rounded-full bg-solix-bg group-hover:bg-solix-green group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
