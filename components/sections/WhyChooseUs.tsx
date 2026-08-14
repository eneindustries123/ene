'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Award, Wrench } from 'lucide-react';

export function WhyChooseUs() {
  const pillars = [
    {
      num: '01',
      title: 'Engineering Expertise',
      description: 'Solutions are developed around actual electrical, structural, environmental, and operational requirements.',
      icon: Cpu,
    },
    {
      num: '02',
      title: 'Integrated Project Delivery',
      description: 'Engineering, procurement, fabrication, installation, testing, and commissioning are coordinated through one project workflow.',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'Quality-Focused Execution',
      description: 'Materials, equipment, fabrication, and installation processes are selected and managed around reliability and long-term performance.',
      icon: Award,
    },
    {
      num: '04',
      title: 'Continued Technical Support',
      description: 'Our involvement extends beyond installation through monitoring, maintenance coordination, troubleshooting, and technical assistance.',
      icon: Wrench,
    },
  ];

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-solix-green">
          WHY E&E
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
          Engineering Confidence From Concept to Completion.
        </h2>
        <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
          E&E combines technical expertise, reliable sourcing, disciplined execution, and continued project support to deliver engineering solutions designed around real operational requirements.
        </p>
      </div>

      {/* 4 Mini Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {pillars.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-solix-border shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green group-hover:bg-solix-dark group-hover:text-white transition-colors shadow-sm">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-solix-muted/60 font-mono">{item.num}</span>
                </div>
                <h3 className="text-lg font-extrabold text-solix-dark group-hover:text-solix-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-solix-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Background Visual 5: Panoramic Solar Rooftop at Sunset */}
      <div className="relative w-full h-[260px] sm:h-[360px] rounded-3xl sm:rounded-4xl overflow-hidden shadow-solix border border-solix-border">
        <Image
          src="/images/why-ee-panoramic.jpg"
          alt="E&E Industrial Solar Infrastructure Panoramic Rooftop Array"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/65 via-transparent to-transparent" />
      </div>
    </section>
  );
}
