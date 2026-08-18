'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Award } from 'lucide-react';

export function PanoramicBenefits() {
  const benefits = [
    {
      icon: Leaf,
      title: 'Renewable & Sustainable',
      description: 'Solar & wind energy is a clean, infinite resource that generates continuous electricity without emitting carbon pollutants.',
    },
    {
      icon: TrendingUp,
      title: 'Increased Property Value',
      description: 'Eco-friendly energy integration increases residential and commercial facility appraisal values while lowering operational overhead.',
    },
    {
      icon: Award,
      title: 'Government Incentives',
      description: 'Take advantage of Federal ITC tax credits, accelerated MACRS depreciation, and municipal grants for clean energy adopters.',
    },
  ];

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Floating White Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-20 bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 shadow-solix-lg border border-solix-border/70 mb-8 max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-solix-border/60">
          {benefits.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={item.title} className={idx === 0 ? 'pt-2 md:pt-0 md:pr-6' : idx === 1 ? 'pt-6 md:pt-0 md:px-6' : 'pt-6 md:pt-0 md:pl-6'}>
                <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-dark mb-4 shadow-sm">
                  <IconComponent className="w-5 h-5 text-solix-greenDark" />
                </div>
                <h3 className="text-base font-bold text-solix-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Full-width Panoramic Renewable Energy Image */}
      <div className="relative w-full h-[320px] sm:h-[450px] rounded-3xl sm:rounded-4xl overflow-hidden shadow-solix">
        <Image
          src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2000&auto=format&fit=crop"
          alt="Panoramic Green Turbine Landscape"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/40 via-transparent to-transparent" />
      </div>
    </section>
  );
}
