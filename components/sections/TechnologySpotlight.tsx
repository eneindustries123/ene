'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function TechnologySpotlight() {
  const capabilities = [
    { label: 'Solutions', value: 'On-Grid · Off-Grid · Hybrid' },
    { label: 'Applications', value: 'Residential · Commercial · Industrial · Agricultural' },
    { label: 'Delivery', value: 'Design · Procurement · Installation' },
    { label: 'Completion', value: 'Testing · Commissioning · Handover' },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline & Description */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-solix-green">
            SOLAR HIGHLIGHT
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-[1.15] text-balance">
            Powering Your Future With Smarter Solar.
          </h2>

          <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
            Electro delivers tailored solar energy solutions for residential, commercial, industrial, and agricultural projects—from assessment and system design to installation and commissioning.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/solar-energy"
              className="group flex items-center gap-3 bg-solix-dark hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-full transition-all shadow-md"
            >
              <span>Explore Solar Solutions</span>
              <div className="w-5 h-5 rounded-full bg-white text-solix-dark flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </div>
            </Link>

            <Link
              href="/request-a-quote"
              className="text-xs font-bold text-solix-dark hover:text-solix-green border-b border-solix-dark/30 hover:border-solix-green transition-colors pb-0.5"
            >
              Request a Quote
            </Link>
          </div>
        </motion.div>

        {/* Center Column: Visual 4 (Solar Engineer with Tablet) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-4 flex justify-center py-4"
        >
          <div className="relative w-64 sm:w-72 h-[380px] sm:h-[420px] rounded-full overflow-hidden shadow-solix-lg border-4 border-white">
            <Image
              src="/images/solar-engineer-tablet.jpg"
              alt="Electro Commercial Solar Engineer with Digital Tablet"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>

        {/* Right Column: Solar Capabilities Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-solix-border shadow-solix space-y-6"
        >
          <div className="flex items-center justify-between border-b border-solix-border pb-3">
            <h3 className="text-lg font-extrabold text-solix-dark">
              Solar Capabilities
            </h3>
            <CheckCircle2 className="w-5 h-5 text-solix-green" />
          </div>

          <div className="space-y-4">
            {capabilities.map((item) => (
              <div key={item.label} className="space-y-1 pb-3 border-b border-solix-border/40 last:border-0">
                <span className="text-[11px] font-bold text-solix-muted uppercase tracking-wider">{item.label}</span>
                <div className="text-xs font-extrabold text-solix-dark">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/solar-energy"
              className="w-full flex items-center justify-center gap-2 bg-solix-dark hover:bg-black text-white font-semibold text-xs py-3 rounded-full transition-colors"
            >
              <span>View Solar Energy Services</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
