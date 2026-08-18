'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CoreExpertise() {
  const services = [
    {
      num: '01',
      title: 'Solar Energy',
      href: '/solar-energy',
      description: 'Complete solar engineering solutions covering assessment, system design, equipment selection, installation, commissioning, monitoring, maintenance, and project support.',
      image: '/images/service-solar.jpg',
      cta: 'Explore Solar Solutions',
      imageLeft: true,
    },
    {
      num: '02',
      title: 'Trading & Contracting',
      href: '/trading-contracting',
      description: 'Technical procurement, material sourcing, electrical equipment supply, industrial materials, contracting, and coordinated project execution for commercial and industrial requirements.',
      image: '/images/service-trading.jpg',
      cta: 'Explore Contracting Services',
      imageLeft: false,
    },
    {
      num: '03',
      title: 'Fabrication & Design',
      href: '/fabrication-design',
      description: 'Structural engineering and fabrication solutions covering solar structures, PEB buildings, steel structures, parking systems, street poles, cable trays, and custom engineering applications.',
      image: '/images/service-fabrication.jpg',
      cta: 'Explore Fabrication Services',
      imageLeft: true,
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-bold uppercase tracking-wider bg-white">
          OUR PRIMARY SERVICES
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight">
          Core Engineering Services
        </h2>
        <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
          Integrated solutions combining clean power engineering, industrial technical procurement, and structural steel fabrication.
        </p>
      </div>

      {/* Alternating Single Service Cards */}
      <div className="space-y-8">
        {services.map((service, idx) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-solix-border shadow-solix hover:shadow-solix-lg transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
          >
            {/* Visual Area */}
            <div
              className={cn(
                'lg:col-span-6 relative w-full h-[240px] sm:h-[320px] rounded-2xl overflow-hidden shadow-sm',
                !service.imageLeft && 'lg:order-2'
              )}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Content Area */}
            <div
              className={cn(
                'lg:col-span-6 space-y-5',
                !service.imageLeft && 'lg:order-1'
              )}
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-solix-bg border border-solix-border text-solix-dark text-xs font-extrabold font-mono">
                {service.num}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-solix-dark group-hover:text-solix-green transition-colors">
                {service.title}
              </h3>

              <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                {service.description}
              </p>

              <div className="pt-2">
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-3 bg-solix-dark hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md group/btn"
                >
                  <span>{service.cta}</span>
                  <div className="w-6 h-6 rounded-full bg-white text-solix-dark flex items-center justify-center group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
