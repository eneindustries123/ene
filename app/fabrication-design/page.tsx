import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Wrench, ArrowUpRight, ShieldCheck, Layers, Cpu } from 'lucide-react';

export const metadata = {
  title: 'Fabrication & Design | E&E',
  description: 'Precision structural steel design and fabrication for solar mounting structures, PEB buildings, street poles, parking shades, and cable trays.',
};

export default function FabricationDesignPage() {
  const capabilities = [
    { title: 'Solar Mounting Structures', desc: 'Custom hot-dip galvanized steel & aluminum mounting for rooftops, ground arrays, elevated sheds, and carports.' },
    { title: 'Steel Street Poles & Lighting', desc: 'High-tensile steel lighting poles, CCTV camera poles, and specialized outdoor poles.' },
    { title: 'Parking Shades & Solar Carports', desc: 'Structural steel parking sheds and integrated commercial solar carports.' },
    { title: 'Pre-Engineered Buildings (PEB)', desc: 'Clear-span structural steel frameworks for industrial factories, warehouses, and logistics centers.' },
    { title: 'Industrial Cable Trays', desc: 'Galvanized cable management trays, ladders, and trunking systems for commercial and solar infrastructure.' },
  ];

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            <Wrench className="w-4 h-4 text-solix-green" />
            <span>Fabrication & Design Service</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Engineered Structures. Precision Fabrication.
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            E&E combines structural design, stress calculations, precision steel fabrication, and on-site assembly for industrial and solar applications.
          </p>
        </div>
      </section>

      {/* Capabilities List */}
      <section className="pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap) => (
            <div key={cap.title} className="bg-white rounded-3xl p-8 border border-solix-border shadow-solix space-y-4">
              <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-solix-dark">{cap.title}</h3>
              <p className="text-xs text-solix-muted leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Process Timeline */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl p-8 sm:p-12 space-y-10 shadow-solix-dark">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Precision Manufacturing</span>
            <h2 className="text-3xl font-extrabold">Fabrication & Design Process</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 text-center text-xs">
            {['1. Concept Design', '2. Structural Engineering', '3. Steel Fabrication', '4. Galvanization', '5. Quality Inspection', '6. On-Site Erection'].map((step) => (
              <div key={step} className="bg-white/10 p-4 rounded-2xl border border-white/10 font-bold text-white">
                {step}
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 bg-white text-solix-dark font-bold text-xs px-6 py-3.5 rounded-full hover:bg-slate-100 transition-colors">
              <span>Discuss Your Fabrication Project</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
