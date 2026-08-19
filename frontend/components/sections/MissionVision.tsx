'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Target } from 'lucide-react';

export function MissionVision() {
  return (
    <section
      id="mission-vision"
      className="py-12 md:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12 scroll-mt-24"
    >
      {/* Editorial Header Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-solix-border/70 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-4"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            OUR PURPOSE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Engineering Progress With Purpose
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
            At E&E Industries, engineering is more than construction—it is a disciplined commitment to dependable energy efficiency, rigorous structural integrity, sustainable industrial development, and creating measurable, enduring value for our clients.
          </p>
        </motion.div>
      </div>

      {/* Editorial Two-Column Mission & Vision Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MISSION */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-solix-border/80 shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between space-y-8 group"
        >
          <div className="space-y-6">
            {/* Badge */}
            <div className="flex items-center justify-between border-b border-solix-border/50 pb-4">
              <span className="text-xs font-bold text-solix-green tracking-widest uppercase">
                MISSION
              </span>
              <div className="w-8 h-8 rounded-full bg-solix-bg border border-solix-border flex items-center justify-center text-solix-dark">
                <Target className="w-4 h-4 text-solix-green" />
              </div>
            </div>

            {/* Subheading */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-solix-dark tracking-tight leading-snug">
              Building Reliable Solutions for Today
            </h3>

            {/* Mission Body Copy */}
            <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
              To deliver reliable, cost-effective energy, engineering, trading, contracting, and fabrication solutions that create measurable value for our clients while supporting sustainable development.
            </p>
          </div>

          {/* Architectural Footer Accent */}
          <div className="pt-6 border-t border-solix-border/50 flex items-center justify-between text-xs text-solix-muted font-medium">
            <span>Practical Engineering & Execution</span>
            <span className="text-solix-green font-bold flex items-center gap-1">
              Measurable Client Value
            </span>
          </div>
        </motion.div>

        {/* VISION */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-solix-border/80 shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between space-y-8 group"
        >
          <div className="space-y-6">
            {/* Badge */}
            <div className="flex items-center justify-between border-b border-solix-border/50 pb-4">
              <span className="text-xs font-bold text-solix-green tracking-widest uppercase">
                VISION
              </span>
              <div className="w-8 h-8 rounded-full bg-solix-bg border border-solix-border flex items-center justify-center text-solix-dark">
                <Compass className="w-4 h-4 text-solix-green" />
              </div>
            </div>

            {/* Subheading */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-solix-dark tracking-tight leading-snug">
              Engineering a Smarter, Sustainable Future
            </h3>

            {/* Vision Body Copy */}
            <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
              To become a trusted leader in integrated energy and industrial solutions, recognized for engineering excellence, dependable execution, innovation, and long-term partnerships.
            </p>
          </div>

          {/* Architectural Footer Accent */}
          <div className="pt-6 border-t border-solix-border/50 flex items-center justify-between text-xs text-solix-muted font-medium">
            <span>Leadership & Innovation</span>
            <span className="text-solix-green font-bold flex items-center gap-1">
              Long-Term Partnership
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
