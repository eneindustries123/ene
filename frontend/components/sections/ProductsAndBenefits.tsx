'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/data';
import { cn } from '@/lib/utils';

export function ProductsAndBenefits() {
  const [activeRow, setActiveRow] = useState<number>(1); // Index 1 is active ("Eco-Friendly Technology")

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Centered Heading */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight">
          Futures That We Provide
        </h2>
        <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
          Scalable green energy solutions designed to empower enterprises and residential communities with clean power.
        </p>
      </div>

      {/* Dual Asymmetric Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-6 lg:col-span-6 relative h-[280px] sm:h-[360px] rounded-3xl overflow-hidden shadow-solix border border-solix-border group"
        >
          <Image
            src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1000&auto=format&fit=crop"
            alt="Wind Turbine Farm Blue Sky"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        {/* Right Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-6 lg:col-span-6 relative h-[280px] sm:h-[360px] rounded-3xl overflow-hidden shadow-solix border border-solix-border group"
        >
          <Image
            src="https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1000&auto=format&fit=crop"
            alt="Wind Turbines Sunset Field"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        </motion.div>
      </div>

      {/* Product & Service Rows */}
      <div className="space-y-4">
        {INITIAL_SERVICES.map((service, index) => {
          const isActive = activeRow === index;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveRow(index)}
              className={cn(
                'group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6',
                isActive
                  ? 'bg-white shadow-solix-lg border-solix-dark/10'
                  : 'bg-white/50 hover:bg-white border-solix-border/60 hover:border-solix-border'
              )}
            >
              {/* Row Left Title */}
              <div className="md:w-1/3">
                <h3 className="text-xl sm:text-2xl font-bold text-solix-dark group-hover:text-solix-green transition-colors">
                  {service.title}
                </h3>
              </div>

              {/* Row Center Description */}
              <div className="md:w-1/2">
                <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              {/* Row Right Arrow Action */}
              <div className="flex justify-end">
                <Link
                  href={`/products/${service.slug}`}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                    isActive
                      ? 'bg-solix-dark text-white shadow-md scale-105'
                      : 'bg-transparent text-solix-dark group-hover:bg-solix-dark group-hover:text-white'
                  )}
                >
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
