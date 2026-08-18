import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowUpRight, CheckCircle2, Sun, ShieldCheck, Zap, Layers } from 'lucide-react';

export const metadata = {
  title: 'Solar Energy Solutions | E&E',
  description: 'Solar energy solutions engineered for Pakistan. Residential, commercial, industrial, and agricultural solar EPC, net metering, and maintenance.',
};

export default function SolarEnergyPage() {
  const packages = [
    {
      capacity: '10KW Package',
      suitableFor: 'Large Residences & Commercial Shops',
      generation: '1,200 - 1,400 Units / Month',
      type: 'On-Grid & Hybrid Options',
      usage: '3-4 ACs, Heavy Water Pump, Deep Freezers',
    },
    {
      capacity: '15KW Package',
      suitableFor: 'Commercial Outlets & Executive Villas',
      generation: '1,800 - 2,100 Units / Month',
      type: 'On-Grid & Hybrid Options',
      usage: '4-5 ACs, Commercial Refrigeration, Central Office Load',
    },
    {
      capacity: '20KW Package',
      suitableFor: 'Factories & Commercial Buildings',
      generation: '2,400 - 2,800 Units / Month',
      type: 'On-Grid & Hybrid Options',
      usage: 'Industrial Machines, Commercial HVAC Systems',
    },
  ];

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Solar Energy Service</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Solar Energy Solutions Engineered for Pakistan
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            E&E provides complete solar engineering and project execution for residential, commercial, industrial, institutional, and agricultural applications.
          </p>
        </div>
      </section>

      {/* Sector Capabilities */}
      <section className="pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix space-y-3">
            <h3 className="text-xl font-bold text-solix-dark">Commercial Solar</h3>
            <p className="text-xs text-solix-muted leading-relaxed">Tailored rooftop and ground arrays for offices, retail hubs, warehouses, and institutions.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix space-y-3">
            <h3 className="text-xl font-bold text-solix-dark">Residential Solar</h3>
            <p className="text-xs text-solix-muted leading-relaxed">On-grid and hybrid energy systems engineered for zero grid outages and reduced utility bills.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix space-y-3">
            <h3 className="text-xl font-bold text-solix-dark">Industrial Solar</h3>
            <p className="text-xs text-solix-muted leading-relaxed">High-capacity Megawatt solar systems designed for heavy daytime motor and factory loads.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix space-y-3">
            <h3 className="text-xl font-bold text-solix-dark">Agricultural Solar</h3>
            <p className="text-xs text-solix-muted leading-relaxed">Solar water pumping tubewells and off-grid remote agricultural energy solutions.</p>
          </div>
        </div>
      </section>

      {/* EPC Execution Process */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl p-8 sm:p-12 space-y-10 shadow-solix-dark">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">End-to-End Workflow</span>
            <h2 className="text-3xl font-extrabold">Engineering, Procurement & Construction (EPC)</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-center text-xs">
            {['1. Site Assessment', '2. Load Analysis', '3. Engineering Design', '4. Procurement', '5. Installation', '6. Commissioning', '7. Net Metering'].map((step) => (
              <div key={step} className="bg-white/10 p-4 rounded-2xl border border-white/10 font-bold text-white">
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar Packages Grid */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-solix-dark tracking-tight">Solar Energy System Packages</h2>
          <p className="text-sm text-solix-muted mt-2">10KW, 15KW, and 20KW complete solar packages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.capacity} className="bg-white rounded-3xl p-8 border border-solix-border shadow-solix space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-bold text-solix-green uppercase tracking-wider">{pkg.type}</div>
                <h3 className="text-2xl font-extrabold text-solix-dark">{pkg.capacity}</h3>
                <p className="text-xs font-semibold text-solix-muted">{pkg.suitableFor}</p>

                <div className="space-y-2 pt-4 border-t text-xs">
                  <div className="flex justify-between"><span className="text-solix-muted">Generation:</span><span className="font-bold text-solix-dark">{pkg.generation}</span></div>
                  <div className="flex justify-between"><span className="text-solix-muted">Usage:</span><span className="font-bold text-solix-dark">{pkg.usage}</span></div>
                </div>
              </div>

              <Link href="/request-a-quote" className="w-full flex items-center justify-center gap-2 bg-solix-dark text-white text-xs font-bold py-3.5 rounded-full hover:bg-black transition-colors">
                <span>Request Custom Quote</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
