'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PARTNERS = [
  { name: 'Canadian Solar', logo: '/partners/canadiansolar.webp' },
  { name: 'GoodWe', logo: '/partners/goodwe.webp' },
  { name: 'Growatt', logo: '/partners/growatt.webp' },
  { name: 'Huawei', logo: '/partners/huawei.webp' },
  { name: 'Inverex', logo: '/partners/inverex.webp' },
  { name: 'JA Solar', logo: '/partners/ja-solar.webp' },
  { name: 'Jinko Solar', logo: '/partners/jinko-solar.webp' },
  { name: 'LONGI', logo: '/partners/longi.webp' },
  { name: 'Solis', logo: '/partners/solis.webp' },
  { name: 'Sunni', logo: '/partners/sunni.webp' },
];

export function PartnersShowcase() {
  return (
    <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-bold uppercase tracking-wider bg-white">
          OUR TECHNOLOGY PARTNERS
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-solix-dark tracking-tight">
          Trusted Technology Behind Every Project
        </h2>
        <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
          We work with established solar and energy technology brands to deliver reliable, high-performance systems across our projects.
        </p>
      </div>

      {/* Responsive Static Grid of Logos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
        {PARTNERS.map((partner, idx) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-solix-border/70 hover:border-solix-green/40 hover:shadow-md transition-all duration-300 flex items-center justify-center h-24 group"
          >
            <div className="relative w-full h-12 flex items-center justify-center">
              <Image
                src={partner.logo}
                alt={`${partner.name} Logo`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
