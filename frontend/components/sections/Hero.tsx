'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Award, Zap } from 'lucide-react';

interface HeroSlide {
  id: string;
  serviceTitle: string;
  description: string;
  image: string;
  label: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'solar',
    serviceTitle: 'Solar Energy',
    description:
      'Full-lifecycle engineering, procurement, and construction (EPC) of high-yield commercial, industrial, and residential solar power systems with turnkey net metering.',
    image: '/hero/solar-hero.jpg',
    label: 'Solar Energy',
  },
  {
    id: 'trading',
    serviceTitle: 'Trading & Contracting',
    description:
      'Reliable industrial procurement, global supply chain sourcing, electrical hardware supply, and turnkey contracting for enterprise developments.',
    image: '/hero/trading-hero.jpg',
    label: 'Trading & Contracting',
  },
  {
    id: 'fabrication',
    serviceTitle: 'Fabrication & Design',
    description:
      'Precision structural steel fabrication, custom solar mounting systems, pre-engineered buildings (PEB), high-mast poles, and industrial cable trays.',
    image: '/hero/fabrication-hero.jpg',
    label: 'Fabrication & Design',
  },
];

const AUTO_PLAY_INTERVAL = 3000; // 3 seconds

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Continuous infinite auto-sliding loop (never stops)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = HERO_SLIDES[activeIndex];

  return (
    <section className="relative w-full min-h-0 md:min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 pb-10 md:pb-16 px-4 sm:px-8 overflow-hidden select-none">
      {/* Background Image Crossfade & Cinematic Scale (Animated) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-solix-dark">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.35 : 0.85,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentSlide.image}
              alt={`E&E ${currentSlide.serviceTitle}`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Dark Gradient Overlays for High Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-solix-dark/95 via-solix-dark/80 to-solix-dark/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-solix-dark/60 via-transparent to-solix-bg z-10" />
      </div>

      {/* Hero Main Content Shell (Mounted & Fixed Framework) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full pt-2 sm:pt-4">
        <div className="max-w-3xl flex flex-col space-y-6">
          {/* 1. Animated Eyebrow Category Pill (Fixed Height Row) */}
          <div className="h-8 sm:h-9 flex items-center shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-extrabold tracking-widest uppercase">
                  <span>{currentSlide.label}</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. Headline: Static "E&E" on Line 1, Reserved-Height Dynamic Service Title on Line 2 */}
          <div className="shrink-0 space-y-1">
            <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
              E&amp;E
            </div>
            <div className="min-h-[5.25rem] sm:min-h-[4.5rem] lg:min-h-[5.25rem] flex items-start">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] w-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={currentSlide.id}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="block"
                  >
                    {currentSlide.serviceTitle}
                  </motion.span>
                </AnimatePresence>
              </h1>
            </div>
          </div>

          {/* 3. Animated Service Description (Reserved Fixed-Height Container) */}
          <div className="min-h-[8.5rem] sm:min-h-[5.5rem] lg:min-h-[5rem] flex items-start shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={currentSlide.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-base sm:text-lg text-white/85 font-normal leading-relaxed max-w-2xl text-balance"
              >
                {currentSlide.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* 4. Completely Static CTAs (Never remount or fade) */}
          <div className="flex flex-wrap items-center gap-4 pt-1 shrink-0">
            {/* Primary CTA -> Scroll to Services */}
            <Link
              href="#services"
              className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm h-14 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl shrink-0"
            >
              <span>Explore Our Services</span>
              <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>

            {/* Secondary CTA -> Scroll to Mission & Vision */}
            <Link
              href="#mission-vision"
              className="inline-flex items-center justify-center text-white/90 hover:text-white text-sm font-semibold h-14 px-6 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur border border-white/20 transition-all shrink-0"
            >
              Mission &amp; Vision
            </Link>
          </div>

          {/* 5. Completely Static Trust / Qualifier Row */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs font-medium text-white/80 shrink-0">
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
              <span>Residential, Commercial &amp; Industrial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing for Lower Integrated Stats Panel (Desktop only) */}
      <div className="relative z-20 hidden md:block h-12 sm:h-20" />
    </section>
  );
}
