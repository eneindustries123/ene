import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowUpRight, ShieldCheck, Activity, Wrench, Clock, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Maintenance Services | Solix Renewable Energy',
  description: 'Preventive, corrective, automated drone panel cleaning, and 24/7 IoT telemetry monitoring for wind and solar installations.',
};

export default function MaintenancePage() {
  const plans = [
    {
      name: 'Essential Care',
      price: '$499/mo',
      features: ['Annual thermal drone imaging', '24/7 IoT SCADA telemetry monitoring', 'Quarterly inverter inspections', '48-hr technician SLA guarantee'],
      recommended: false,
    },
    {
      name: 'Pro Performance',
      price: '$1,299/mo',
      features: ['Bi-annual robotic panel cleaning', 'Predictive AI failure analytics', 'Monthly performance audit reports', '24-hr rapid technician SLA guarantee', 'Full spare parts coverage'],
      recommended: true,
    },
    {
      name: 'Enterprise Grid',
      price: 'Custom Quote',
      features: ['Dedicated on-site field team', 'Substation & pitch control calibration', 'Custom microgrid firmware updates', '4-hr immediate dispatch SLA', 'Zero-downtime availability guarantee'],
      recommended: false,
    },
  ];

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            Asset Operations & Service
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            24/7 Asset Telemetry & Maintenance
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            Guarantee maximum clean energy uptime, mitigate hardware degradation, and safeguard long-term asset valuations.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-solix-border shadow-solix space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-greenDark">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-solix-dark">Real-Time Telemetry</h3>
            <p className="text-xs text-solix-muted leading-relaxed">
              Continuous IoT sensor monitoring tracking string voltage, inverter temperatures, grid frequency, and ambient solar irradiance.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-solix-border shadow-solix space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-greenDark">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-solix-dark">Predictive Maintenance</h3>
            <p className="text-xs text-solix-muted leading-relaxed">
              Machine learning algorithms identify cell micro-cracks, gear wear, and thermal hot spots long before catastrophic failure occurs.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-solix-border shadow-solix space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-greenDark">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-solix-dark">Rapid Dispatch SLA</h3>
            <p className="text-xs text-solix-muted leading-relaxed">
              Guaranteed on-site technician response times down to 4 hours with fully equipped mobile maintenance units.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Service Plans */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-solix-dark tracking-tight">Structured Service Plans</h2>
          <p className="text-sm text-solix-muted mt-2">Comprehensive maintenance tailored to your clean energy array size.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 border flex flex-col justify-between space-y-8 relative ${
                plan.recommended
                  ? 'bg-solix-dark text-white border-solix-dark shadow-solix-dark scale-105'
                  : 'bg-white text-solix-dark border-solix-border shadow-solix'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-solix-green text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="text-3xl font-extrabold mt-2">{plan.price}</div>
                </div>

                <div className="space-y-3 text-xs border-t pt-6 border-white/20">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 shrink-0 ${plan.recommended ? 'text-emerald-400' : 'text-solix-green'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/request-a-quote"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold transition-colors ${
                  plan.recommended
                    ? 'bg-white text-solix-dark hover:bg-slate-100'
                    : 'bg-solix-dark text-white hover:bg-black'
                }`}
              >
                <span>Select Plan</span>
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
