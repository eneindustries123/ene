import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Briefcase, ArrowUpRight, CheckCircle2, ShieldCheck, Box, Zap } from 'lucide-react';

export const metadata = {
  title: 'Trading & Contracting | E&E',
  description: 'Technical procurement, material sourcing, electrical equipment supply, solar panels, inverters, cables, and industrial raw materials.',
};

export default function TradingContractingPage() {
  const materials = [
    { title: 'Solar Panels & Inverters', desc: 'Tier-1 monocrystalline panels, TOPCon modules, on-grid & hybrid inverters.' },
    { title: 'Solar Mounting Structures', desc: 'Rooftop, ground-mount, elevated sheds, and custom structural steel.' },
    { title: 'Electrical Components', desc: 'TÜV certified DC cables, AC breakers, distribution DB boxes, protection fuses.' },
    { title: 'Industrial Raw Materials', desc: 'Silica, sand, iron, and specialized project-specific industrial commodities.' },
  ];

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            <Briefcase className="w-4 h-4 text-solix-green" />
            <span>Trading & Contracting Service</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Technical Procurement & Contracting You Can Rely On
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            E&E provides structured technical sourcing, electrical equipment supply, industrial raw materials, and contracting support for enterprise projects.
          </p>
        </div>
      </section>

      {/* Product & Supply Categories Grid */}
      <section className="pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {materials.map((mat) => (
            <div key={mat.title} className="bg-white rounded-3xl p-8 border border-solix-border shadow-solix space-y-4">
              <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-solix-dark">{mat.title}</h3>
              <p className="text-xs text-solix-muted leading-relaxed">{mat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Procurement Process Timeline */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl p-8 sm:p-12 space-y-10 shadow-solix-dark">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Quality Assurance</span>
            <h2 className="text-3xl font-extrabold">Technical Procurement Timeline</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center text-xs">
            {['1. Requirement Analysis', '2. Technical Evaluation', '3. Sourcing & Verification', '4. Quality Inspection', '5. Site Delivery'].map((step) => (
              <div key={step} className="bg-white/10 p-5 rounded-2xl border border-white/10 font-bold text-white">
                {step}
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 bg-white text-solix-dark font-bold text-xs px-6 py-3.5 rounded-full hover:bg-slate-100 transition-colors">
              <span>Request Supply Quotation</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
