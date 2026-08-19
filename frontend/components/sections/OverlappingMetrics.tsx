'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function OverlappingMetrics() {
  const stats = [
    { value: '10+', label: 'Years of Experience', subtext: 'Proven engineering execution' },
    { value: '50MW', label: 'Annual Production', subtext: 'Total clean power output' },
    { value: '100%', label: 'Efficiency Rating', subtext: 'Quality & performance guaranteed' },
  ];

  return (
    <div className="hidden md:block relative z-30 max-w-7xl mx-auto px-4 sm:px-8 -mt-16 sm:-mt-24 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 shadow-solix-lg border border-solix-border/70"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-solix-border/60">
          {stats.map((item, idx) => (
            <div
              key={item.label}
              className={cn(
                'flex flex-col justify-between p-3 sm:p-4',
                idx > 0 && 'sm:pl-6'
              )}
            >
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight mb-1">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-solix-dark">
                  {item.label}
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-solix-muted font-medium mt-2">
                {item.subtext}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Helper cn function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
