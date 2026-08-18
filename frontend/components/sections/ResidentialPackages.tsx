'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowUpRight, Zap } from 'lucide-react';
import { RESIDENTIAL_PACKAGES } from '@/lib/data';
import { cn } from '@/lib/utils';

export function ResidentialPackages() {
  const [selectedCapacity, setSelectedCapacity] = useState<string>('10KW');

  const selectedPkg = RESIDENTIAL_PACKAGES.find((p) => p.capacity === selectedCapacity) || RESIDENTIAL_PACKAGES[2];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
          E&E Solar Packages
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight">
          Selectable Solar System Packages
        </h2>
        <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
          Custom engineered solar array solutions configured for residential homes, commercial complexes, and industrial sites.
        </p>
      </div>

      {/* Package Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {RESIDENTIAL_PACKAGES.map((pkg) => (
          <button
            key={pkg.capacity}
            type="button"
            onClick={() => setSelectedCapacity(pkg.capacity)}
            className={cn(
              'px-6 py-3 rounded-full text-xs font-bold transition-all border',
              selectedCapacity === pkg.capacity
                ? 'bg-solix-dark text-white border-solix-dark shadow-md scale-105'
                : 'bg-white text-solix-dark border-solix-border hover:border-solix-dark'
            )}
          >
            {pkg.capacity} Package
          </button>
        ))}
      </div>

      {/* Package Detail Card */}
      <motion.div
        key={selectedPkg.capacity}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix-lg max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
      >
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green font-black text-xl">
              {selectedPkg.capacity}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-solix-green">{selectedPkg.systemCategory}</span>
              <h3 className="text-2xl font-extrabold text-solix-dark">{selectedPkg.suitableFor}</h3>
            </div>
          </div>

          <div className="space-y-2 bg-solix-bg/70 p-4 rounded-2xl border border-solix-border/50 text-xs">
            <div className="flex justify-between py-1 border-b border-solix-border/40">
              <span className="text-solix-muted">Estimated Generation:</span>
              <span className="font-bold text-solix-dark">{selectedPkg.estimatedGeneration}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-solix-border/40">
              <span className="text-solix-muted">Typical Load Capacity:</span>
              <span className="font-bold text-solix-dark">{selectedPkg.typicalUsage}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-solix-muted">Grid Compatibility:</span>
              <span className="font-bold text-solix-green">On-Grid & Hybrid Net-Metering Ready</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-solix-dark">Included Package Components</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedPkg.components.map((comp) => (
                <div key={comp} className="flex items-center gap-2 text-solix-dark font-medium">
                  <CheckCircle2 className="w-4 h-4 text-solix-green shrink-0" />
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="md:col-span-5 bg-solix-dark text-white rounded-2xl p-6 sm:p-8 text-center space-y-6 flex flex-col justify-between h-full border border-white/10 shadow-solix-dark">
          <div className="space-y-3">
            <Zap className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-xl font-extrabold">Ready for {selectedPkg.capacity} Solar?</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Get an accurate load assessment, rooftop orientation measurement, and custom financial quotation.
            </p>
          </div>

          <Link
            href="/request-a-quote"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-solix-dark font-bold text-xs py-3.5 rounded-full transition-colors shadow-md"
          >
            <span>Request Custom Quote</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
