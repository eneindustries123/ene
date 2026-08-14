'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Award, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between pt-24 sm:pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
      {/* Official Hero Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ee-hero.jpg"
          alt="E&E Industrial Rooftop Solar Infrastructure Engineering"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        {/* Dark Green/Black Directional Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-solix-dark/95 via-solix-dark/85 to-solix-dark/45 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-solix-dark/60 via-transparent to-solix-bg z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full pt-2 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl space-y-6"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase">
            <span>ENGINEERING</span>
            <span className="text-emerald-400">•</span>
            <span>ENERGY</span>
            <span className="text-emerald-400">•</span>
            <span>INFRASTRUCTURE</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] text-balance">
            Engineering Smarter Energy & Infrastructure Solutions
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/85 font-normal leading-relaxed max-w-2xl text-balance">
            E&E delivers integrated solar energy, trading and contracting, and fabrication and design solutions for residential, commercial, industrial, and infrastructure projects.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="#services"
              className="group flex items-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Explore Our Services</span>
              <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>

            <Link
              href="/request-a-quote"
              className="text-white/90 hover:text-white text-sm font-semibold px-6 py-3.5 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur border border-white/20 transition-all"
            >
              Request a Quote
            </Link>
          </div>

          {/* Trust / Qualifier Row */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs font-medium text-white/80">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>10+ Years Engineering Track Record</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>50MW Annual Solar Capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Residential, Commercial & Industrial</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spacing for Lower Integrated Stats Panel */}
      <div className="relative z-20 h-12 sm:h-20" />
    </section>
  );
}
