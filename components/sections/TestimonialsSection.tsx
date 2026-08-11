'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Building2, CheckCircle2 } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 't-1',
      quote: 'Electro handled our commercial solar EPC project professionally from engineering design through installation and net metering commissioning. Their team delivered a structured, transparent, and high-yielding power system.',
      authorName: 'Ahmed Raza',
      authorRole: 'Project Manager',
      company: 'Logistics Complex Multan',
      projectType: '1.2MW Commercial Solar Array',
    },
    {
      id: 't-2',
      quote: 'The technical procurement and structural steel fabrication standards provided by Electro exceeded our industrial requirements. Material sourcing was on-schedule and fully compliant with project specs.',
      authorName: 'Usman Khalid',
      authorRole: 'Operations Director',
      company: 'Industrial Manufacturing Hub',
      projectType: 'Structural Fabrication & Material Supply',
    },
    {
      id: 't-3',
      quote: 'From rooftop load calculations to elevated steel shed construction and grid sync, the Electro engineering team provided responsive technical support throughout our 40KW solar transition.',
      authorName: 'Sara Ahmed',
      authorRole: 'Facilities Head',
      company: 'Retail Commercial Center',
      projectType: '40KW Elevated Solar Shed',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading & Carousel Controls */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-solix-green">
            CLIENT EXPERIENCES
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight text-balance">
            What Our Clients Say About Working With Electro.
          </h2>

          <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
            Direct B2B client feedback on project delivery, technical execution, procurement reliability, and ongoing support across our solar, trading, and fabrication services.
          </p>

          {/* Carousel Control Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-solix-dark/30 hover:border-solix-dark flex items-center justify-center text-solix-dark hover:bg-solix-dark hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Previous Testimonial"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-solix-dark text-white flex items-center justify-center hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
              aria-label="Next Testimonial"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>

        {/* Right Column: Credible B2B Quote Card */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix-lg space-y-6"
            >
              <div className="flex items-center justify-between border-b border-solix-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green">
                    <Quote className="w-5 h-5 rotate-180 fill-current" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-solix-green uppercase tracking-wider">Project Context</span>
                    <div className="text-xs font-extrabold text-solix-dark">{activeTestimonial.projectType}</div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-solix-muted font-medium">
                  <CheckCircle2 className="w-4 h-4 text-solix-green" />
                  <span>Verified B2B Client</span>
                </div>
              </div>

              <blockquote className="text-base sm:text-xl text-solix-dark font-medium leading-relaxed italic">
                "{activeTestimonial.quote}"
              </blockquote>

              <div className="pt-4 border-t border-solix-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-base font-extrabold text-solix-dark">
                    {activeTestimonial.authorName}
                  </div>
                  <div className="text-xs text-solix-muted font-semibold">
                    {activeTestimonial.authorRole} • <span className="text-solix-dark font-bold">{activeTestimonial.company}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-solix-bg px-4 py-2 rounded-full border border-solix-border text-xs font-bold text-solix-dark">
                  <Building2 className="w-4 h-4 text-solix-green" />
                  <span>Commercial & Industrial Case Study</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
