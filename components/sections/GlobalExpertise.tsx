'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu } from 'lucide-react';

export function GlobalExpertise() {
  const flags = [
    { country: 'USA', x: '24%', y: '36%', flag: '🇺🇸' },
    { country: 'Brazil', x: '35%', y: '72%', flag: '🇧🇷' },
    { country: 'UK', x: '46%', y: '26%', flag: '🇬🇧' },
    { country: 'Germany', x: '52%', y: '30%', flag: '🇩🇪' },
    { country: 'UAE', x: '65%', y: '45%', flag: '🇦🇪' },
    { country: 'China', x: '78%', y: '38%', flag: '🇨🇳' },
    { country: 'Japan', x: '86%', y: '36%', flag: '🇯🇵' },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & Value Propositions */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Pill Badge */}
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            Who we are
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight text-balance">
            Experts In The World Of Renewable Energy.
          </h2>

          <p className="text-base text-solix-muted leading-relaxed">
            With installations spanning 4 continents, Solix combines global engineering precision with localized grid compliance to accelerate zero-carbon energy transitions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {/* Feature 1 */}
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-solix-border flex items-center justify-center text-solix-dark shadow-sm">
                <ShieldCheck className="w-5 h-5 text-solix-greenDark" />
              </div>
              <h3 className="text-base font-bold text-solix-dark">
                Commercial & Industrial
              </h3>
              <p className="text-xs text-solix-muted leading-relaxed">
                Tailored power array solutions for enterprise facilities, manufacturing hubs, and public infrastructure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-solix-border flex items-center justify-center text-solix-dark shadow-sm">
                <Cpu className="w-5 h-5 text-solix-greenDark" />
              </div>
              <h3 className="text-base font-bold text-solix-dark">
                Grid Optimization
              </h3>
              <p className="text-xs text-solix-muted leading-relaxed">
                Advanced BESS storage microgrids and automated load balancing for guaranteed power independence.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: World Map SVG Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 relative bg-white/60 rounded-3xl p-6 sm:p-10 border border-solix-border/70 shadow-solix"
        >
          <div className="relative w-full aspect-[16/9] min-h-[260px] sm:min-h-[340px] flex items-center justify-center">
            {/* Map SVG Graphic Representation */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full text-solix-border stroke-current fill-none opacity-80"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* World Map Dotted Outlines */}
              <g fill="#CBD2CE" stroke="none" opacity="0.4">
                {/* North America dots */}
                <circle cx="200" cy="180" r="4" />
                <circle cx="230" cy="160" r="5" />
                <circle cx="250" cy="190" r="4" />
                <circle cx="280" cy="200" r="6" />
                {/* South America */}
                <circle cx="350" cy="360" r="5" />
                <circle cx="370" cy="390" r="4" />
                {/* Europe */}
                <circle cx="480" cy="140" r="5" />
                <circle cx="520" cy="150" r="6" />
                {/* Middle East & Asia */}
                <circle cx="650" cy="220" r="5" />
                <circle cx="780" cy="190" r="6" />
                <circle cx="850" cy="180" r="5" />
              </g>

              {/* Animated Dashed Connection Curves */}
              <motion.path
                d="M 240 180 Q 360 100 520 150"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
              <motion.path
                d="M 520 150 Q 580 280 650 225"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
              />
              <motion.path
                d="M 650 225 Q 720 120 780 190"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.6 }}
              />
            </svg>

            {/* Country Markers Overlay */}
            {flags.map((item) => (
              <div
                key={item.country}
                className="absolute flex items-center gap-1.5 bg-white shadow-md border border-solix-border rounded-full px-2.5 py-1 transition-transform hover:scale-110 cursor-pointer"
                style={{ left: item.x, top: item.y }}
              >
                <span className="text-sm">{item.flag}</span>
                <span className="text-[10px] font-bold text-solix-dark hidden sm:inline">{item.country}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
