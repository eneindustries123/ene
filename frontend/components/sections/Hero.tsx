'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight, ShieldCheck, Award, Zap } from 'lucide-react';

interface HeroSlide {
  id: string;
  headline: string;
  description: string;
  image: string;
  label: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'solar',
    headline: 'E&E Solar Energy',
    description:
      'Full-lifecycle engineering, procurement, and construction (EPC) of high-yield commercial, industrial, and residential solar power systems with turnkey net metering.',
    image: '/hero/solar-hero.jpg',
    label: 'Solar Energy',
  },
  {
    id: 'trading',
    headline: 'E&E Trading & Contracting',
    description:
      'Reliable industrial procurement, global supply chain sourcing, electrical hardware supply, and turnkey contracting for enterprise developments.',
    image: '/hero/trading-hero.jpg',
    label: 'Trading & Contracting',
  },
  {
    id: 'fabrication',
    headline: 'E&E Fabrication & Design',
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    resetTimer();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    resetTimer();
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const currentSlide = HERO_SLIDES[activeIndex];

  return (
    <section
      className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 pb-16 px-4 sm:px-8 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image Crossfade & Cinematic Scale */}
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
              alt={currentSlide.headline}
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

      {/* Hero Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Left Column: Animated Text & CTAs */}
          <div className="lg:col-span-9 max-w-3xl space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-6"
              >
                {/* Eyebrow Badge (No Numbering) */}
                <div>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-extrabold tracking-widest uppercase">
                    <span>{currentSlide.label}</span>
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] text-balance">
                  {currentSlide.headline}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-white/85 font-normal leading-relaxed max-w-2xl text-balance">
                  {currentSlide.description}
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  {/* Primary CTA -> Scroll to Services */}
                  <Link
                    href="#services"
                    className="group flex items-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span>Explore Our Services</span>
                    <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </Link>

                  {/* Secondary CTA -> Scroll to Mission & Vision */}
                  <Link
                    href="#mission-vision"
                    className="text-white/90 hover:text-white text-sm font-semibold px-6 py-3.5 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur border border-white/20 transition-all"
                  >
                    Mission & Vision
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

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
          </div>

          {/* Right Column: Arrow Navigation Controls Only (No Numeric Indicators) */}
          <div className="lg:col-span-3 flex items-center justify-start lg:justify-end pt-4 lg:pt-0">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Previous service slide"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Next service slide"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing for Lower Integrated Stats Panel */}
      <div className="relative z-20 h-12 sm:h-20" />
    </section>
  );
}
