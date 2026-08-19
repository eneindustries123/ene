import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Zap,
  Layers,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Award,
  Cpu,
  Package,
  Boxes,
  Truck,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Trading & Contracting | E&E Industries',
  description:
    'Professional trading, technical procurement, and contracting services across Pakistan. Supplying certified solar equipment, electrical components, silica, sand, iron, and industrial minerals.',
};

// 1. Electrical Components Highlights
const ELECTRICAL_HIGHLIGHTS = [
  {
    title: 'Solar Panels',
    description:
      'Premium-grade, high-efficiency monocrystalline and TOPCon panels sourced from top international brands for maximum energy yield and long-term durability.',
  },
  {
    title: 'Solar Inverters',
    description:
      'Advanced on-grid, hybrid, and off-grid solutions built for optimal power conversion, smart cloud monitoring, and seamless grid synchronization.',
  },
  {
    title: 'Solar Structures',
    description:
      'Durable, corrosion-resistant hot-dip galvanized mounting frames custom-engineered for rooftop, ground-mounted, and heavy industrial setups.',
  },
];

const ELECTRICAL_TAGS = [
  'DC/AC Breakers',
  'Surge Protection (SPD)',
  'Distribution Boards (DBs)',
  'Solar Cables (4mm / 6mm)',
  'Earthing Systems',
];

// 2. Industrial Materials Highlights
const INDUSTRIAL_HIGHLIGHTS = [
  {
    title: 'High-Purity Silica',
    description:
      'High-grade silica quartz sourced for industrial processing, glass manufacturing, ceramics, chemical filtration, and specialized refractory applications.',
  },
  {
    title: 'Construction & Foundry Sand',
    description:
      'Graded industrial sand meeting strict grain-size distribution standards for commercial construction, foundry casting, and abrasive blasting.',
  },
  {
    title: 'Industrial Iron & Mineral Ores',
    description:
      'High-grade iron ore and metallurgical raw materials supplied for manufacturing, structural fabrication, and heavy industrial casting.',
  },
];

const INDUSTRIAL_TAGS = [
  'Silica Quartz',
  'Foundry Sand',
  'Industrial Iron',
  'Raw Minerals',
  'Quality-Assured Supply',
  'Bulk Logistics',
];

// 3. Supporting Value Points (Why Choose E&E Trading)
const TRADING_VALUE_POINTS = [
  {
    title: 'Trusted Manufacturers & Certified Suppliers',
    description:
      'Direct procurement partnerships with ISO/IEC-certified global manufacturers and accredited industrial producers.',
  },
  {
    title: 'Quality-Focused Procurement',
    description:
      'Strict batch verification, material purity testing, and international compliance certification prior to dispatch.',
  },
  {
    title: 'Technical Product Understanding',
    description:
      'Engineering-led sourcing ensuring every electrical component and raw material matches exact project specifications.',
  },
  {
    title: 'Cost-Effective Sourcing Solutions',
    description:
      'Strategic bulk purchasing power and streamlined supply networks delivering competitive pricing and maximum value.',
  },
  {
    title: 'Reliable Delivery & Project Support',
    description:
      'Nationwide logistics coverage ensuring on-schedule site delivery, safe handling, and continuous project coordination.',
  },
];

export default function TradingContractingPage() {
  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark flex flex-col justify-between">
      <Header />

      {/* 1. HERO / INTRO SECTION */}
      <section className="relative w-full min-h-screen min-h-[100svh] xl:min-h-[580px] flex items-center justify-center pt-32 pb-20 px-4 sm:px-8 overflow-hidden bg-solix-dark">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/trading-hero.jpg"
            alt="E&E Trading & Contracting Operations"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-solix-dark/95 via-solix-dark/85 to-solix-dark/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-solix-dark/60 via-transparent to-solix-bg z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto w-full text-center space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-extrabold tracking-widest uppercase">
            SERVICES
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] text-balance">
            Trading & Contracting
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed font-normal text-balance">
            At E&E Industries, we provide professional trading and contracting services across Pakistan, supplying high-quality solar equipment, structural components, electrical materials, and industrial materials including silica, sand, iron, and other minerals for residential, commercial, and industrial projects. We work with trusted manufacturers and certified suppliers to ensure reliability, performance, and long-term durability. Our goal is to deliver cost-effective solutions with technical expertise and dependable project execution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/request-a-quote"
              className="group flex items-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Request a Quote</span>
              <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>

            <Link
              href="#offerings"
              className="text-white/90 hover:text-white text-sm font-semibold px-7 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 transition-all"
            >
              Explore Offerings
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE OFFERINGS SECTION (2 EQUAL COLUMNS: ELECTRICAL & INDUSTRIAL) */}
      <section id="offerings" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            CORE OFFERINGS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Comprehensive Supply & Procurement Portfolio
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            Sourcing certified electrical hardware and high-grade industrial commodities with strict quality benchmarks.
          </p>
        </div>

        {/* 2 Equal Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Electrical Components */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 flex flex-col justify-between space-y-8 group h-full">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green group-hover:bg-solix-green group-hover:text-white transition-colors duration-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-solix-muted uppercase tracking-wider bg-solix-bg px-3 py-1 rounded-full border border-solix-border/50">
                    ELECTRICAL HARDWARE
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-solix-dark tracking-tight group-hover:text-solix-green transition-colors">
                    Electrical Components
                  </h3>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed mt-2.5">
                    We trade high-quality electrical components essential for safe and efficient solar and industrial installations. Our product range includes cables, breakers, protection devices, distribution boards, and other critical electrical equipment. All components meet safety standards and ensure reliable power distribution and system protection.
                  </p>
                </div>
              </div>

              {/* Stacked Feature Rows */}
              <div className="space-y-3.5 pt-2">
                {ELECTRICAL_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-solix-bg/80 border border-solix-border/70 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-solix-dark">
                      <CheckCircle2 className="w-4 h-4 text-solix-green shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-xs text-solix-muted leading-relaxed pl-6">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Component Tags */}
            <div className="space-y-2.5 pt-6 border-t border-solix-border/60">
              <div className="text-[11px] font-bold text-solix-dark uppercase tracking-wider">
                Additional Electrical Supplies
              </div>
              <div className="flex flex-wrap gap-2">
                {ELECTRICAL_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 rounded-full bg-solix-bg border border-solix-border text-[11px] font-semibold text-solix-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Industrial Materials */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 flex flex-col justify-between space-y-8 group h-full">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green group-hover:bg-solix-green group-hover:text-white transition-colors duration-300">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-solix-muted uppercase tracking-wider bg-solix-bg px-3 py-1 rounded-full border border-solix-border/50">
                    INDUSTRIAL COMMODITIES
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-solix-dark tracking-tight group-hover:text-solix-green transition-colors">
                    Industrial Materials
                  </h3>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed mt-2.5">
                    E&E Industries supplies high-quality industrial materials including silica, sand, iron, and other essential minerals for construction, manufacturing, and industrial applications across Pakistan. We source materials from reliable and certified suppliers to ensure consistent quality, purity, and performance. Our solutions are tailored to meet project-specific requirements, delivering strength, durability, and cost efficiency for a wide range of industrial and commercial needs.
                  </p>
                </div>
              </div>

              {/* Stacked Feature Rows */}
              <div className="space-y-3.5 pt-2">
                {INDUSTRIAL_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-solix-bg/80 border border-solix-border/70 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-solix-dark">
                      <CheckCircle2 className="w-4 h-4 text-solix-green shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-xs text-solix-muted leading-relaxed pl-6">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Material Tags */}
            <div className="space-y-2.5 pt-6 border-t border-solix-border/60">
              <div className="text-[11px] font-bold text-solix-dark uppercase tracking-wider">
                Key Minerals & Capabilities
              </div>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIAL_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 rounded-full bg-solix-bg border border-solix-border text-[11px] font-semibold text-solix-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTING VALUE SECTION (DEPENDABLE SUPPLY, BACKED BY TECHNICAL EXPERTISE) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="space-y-4 mb-10 max-w-3xl">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            WHY CHOOSE E&E TRADING
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Dependable Supply, Backed by Technical Expertise
          </h2>
          <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
            E&E combines direct manufacturer sourcing, technical product understanding, and nationwide logistics to deliver dependable materials across solar, commercial, and industrial sectors.
          </p>
        </div>

        {/* 2-Column Grid: 5 Value Cards on Left, Full-Height Visual on Right aligned with Top & Bottom Baselines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: 5 Key Value Points */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            {TRADING_VALUE_POINTS.map((point) => (
              <div
                key={point.title}
                className="bg-white rounded-2xl p-5 border border-solix-border/80 shadow-sm flex items-start gap-4 hover:border-solix-green/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-solix-green flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4.5 h-4.5 text-solix-green" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-solix-dark leading-snug">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Full-Height Visual Card Aligned from Top to Bottom Baseline */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden shadow-solix-lg border border-solix-border bg-solix-bg">
              <Image
                src="/images/service-trading.jpg"
                alt="E&E Technical Procurement & Sourcing Logistics"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/90 via-solix-dark/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Turnkey Supply Chain Integrity</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    Strict batch verification, direct certified manufacturer ties, and verified product warranties across all supplied materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA SECTION */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl sm:rounded-4xl p-8 sm:p-14 border border-white/10 shadow-solix-dark relative overflow-hidden text-center space-y-6">
          {/* Background Glow Accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-white/5">
              GET IN TOUCH
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Need reliable supply and contracting support for your next project?
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Let&apos;s discuss your requirements with our procurement specialists and engineering team.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/request-a-quote"
              className="group flex items-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Request a Quote</span>
              <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>

            <Link
              href="/solar-energy"
              className="text-white/90 hover:text-white text-sm font-semibold px-7 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 transition-all"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
