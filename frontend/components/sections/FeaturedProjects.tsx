'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Zap } from 'lucide-react';

export function FeaturedProjects() {
  const projects = [
    {
      id: 'mns-multan',
      title: 'MNS University of Agriculture',
      location: 'Multan, Pakistan',
      capacity: '1.2MW Array',
      category: 'Commercial Solar EPC',
      summary: 'Turnkey megawatt campus solar installation featuring high-efficiency monocrystalline arrays and three-phase industrial string inverters.',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1000&auto=format&fit=crop',
      href: '/projects/mns-university-multan',
    },
    {
      id: 'chakdara-swat',
      title: 'Chakdara Swat Site',
      location: 'Swat, KPK, Pakistan',
      capacity: '25KW Hybrid',
      category: 'Remote Hybrid Power',
      summary: 'Off-grid and hybrid energy infrastructure engineered for harsh mountainous weather and uninterrupted remote power delivery.',
      image: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1000&auto=format&fit=crop',
      href: '/projects/chakdara-swat-25kw',
    },
    {
      id: 'bareeze-dha',
      title: 'Bareeze DHA Elevated Shed',
      location: 'DHA, Lahore, Pakistan',
      capacity: '40KW Elevated Shed',
      category: 'Fabrication & Solar',
      summary: 'Custom-designed elevated structural steel roof shed delivering 40KW clean solar power while maximizing usable rooftop space.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
      href: '/projects/bareeze-dha-40kw-elevated-shed',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-solix-border pb-8">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-solix-green">
            PROVEN TRACK RECORD
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight">
            Featured Engineering Projects
          </h2>
          <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
            Demonstrated engineering execution across commercial solar EPC, technical procurement, and structural steel fabrication.
          </p>
        </div>

        <Link
          href="/projects"
          className="group inline-flex items-center gap-3 bg-solix-dark hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-full transition-all shadow-md shrink-0"
        >
          <span>View All Projects</span>
          <div className="w-5 h-5 rounded-full bg-white text-solix-dark flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          </div>
        </Link>
      </div>

      {/* 3 Featured Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((proj, idx) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="bg-white rounded-3xl overflow-hidden border border-solix-border shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between group"
          >
            {/* Project Image */}
            <div className="relative w-full h-[220px] overflow-hidden">
              <Image
                src={proj.image}
                alt={proj.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-solix-dark/90 backdrop-blur text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {proj.category}
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-solix-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-solix-green" />
                    <span>{proj.location}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-solix-dark">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{proj.capacity}</span>
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-solix-dark group-hover:text-solix-green transition-colors">
                  {proj.title}
                </h3>

                <p className="text-xs text-solix-muted leading-relaxed">
                  {proj.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-solix-border/50">
                <Link
                  href={proj.href}
                  className="inline-flex items-center gap-2 text-xs font-bold text-solix-dark group-hover:text-solix-green transition-colors"
                >
                  <span>Explore Project Case Study</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
