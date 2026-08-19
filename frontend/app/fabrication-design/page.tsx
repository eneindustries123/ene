import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Sun,
  Zap,
  Car,
  Building2,
  Layers,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Award,
  Cpu,
  Wrench,
  Gauge,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Fabrication & Design | E&E Industries',
  description:
    'Precision-engineered structural steel solutions, solar mounting structures, street lighting poles, parking shade carports, PEB buildings, and industrial cable trays across Pakistan.',
};

// 1. Core Services Data (5 Services for Staggered Pyramid Grid)
const FABRICATION_SERVICES = [
  {
    id: 'solar-structures',
    title: 'Solar Structure Designs',
    category: 'SOLAR FABRICATION',
    icon: Sun,
    description:
      'We design and fabricate high-strength solar mounting structures tailored for rooftop and ground-mounted solar systems. Our engineering team ensures optimal tilt angles, wind resistance, load calculations, and corrosion protection to maximize energy efficiency and structural stability. Built for Pakistan’s environmental conditions, our solar structures guarantee durability and long-term reliability.',
  },
  {
    id: 'street-poles',
    title: 'Street Poles',
    category: 'LIGHTING INFRASTRUCTURE',
    icon: Zap,
    description:
      'E&E Industries manufactures durable street poles and lighting structures engineered for strength, safety, and weather resistance. Our poles are fabricated using high-quality steel and precision welding techniques to ensure structural integrity and long service life. Suitable for municipal, commercial, and industrial projects, our solutions meet modern infrastructure standards.',
  },
  {
    id: 'parking-lots',
    title: 'Parking Lots',
    category: 'STRUCTURAL SOLUTIONS',
    icon: Car,
    description:
      'We design and fabricate customized parking lot structures, including solar carport systems and steel shade solutions. Our structures are engineered for load-bearing strength, efficient space utilization, and long-term durability. Ideal for commercial plazas, factories, and residential projects, our parking solutions combine functionality with structural excellence.',
  },
  {
    id: 'peb-buildings',
    title: 'PEB Buildings',
    category: 'INDUSTRIAL INFRASTRUCTURE',
    icon: Building2,
    description:
      'E&E Industries provides high-quality Pre-Engineered Buildings (PEB) for warehouses, factories, commercial facilities, and industrial projects. Our PEB structures are designed for fast installation, cost efficiency, and structural strength while meeting modern engineering standards. We deliver customized building solutions that ensure flexibility, durability, and long-term performance.',
  },
  {
    id: 'cable-trays',
    title: 'Cable Trays',
    category: 'ELECTRICAL SUPPORT SYSTEMS',
    icon: Layers,
    description:
      'E&E Industries designs and fabricates high-quality cable tray systems for safe and organized cable management in commercial, industrial, and infrastructure projects. Our cable trays are manufactured using durable materials and precision engineering to ensure strength, corrosion resistance, and long-term performance. Suitable for a wide range of electrical installations, our solutions provide efficient cable routing, easy maintenance, and reliable support for power and communication systems.',
  },
];

// 2. Supporting Value Points (Why Choose E&E Fabrication)
const VALUE_POINTS = [
  {
    title: 'Custom Steel Fabrication for Solar, Commercial & Industrial Use',
    description:
      'Tailored dimensioning, heavy plate cutting, high-precision CNC punching, beam assembly, and custom profile bending for diverse project scopes.',
  },
  {
    title: 'Precision Engineering & Structural Load Planning',
    description:
      'Advanced 3D CAD modeling, wind-load aerodynamic simulation, seismic resistance calculations, and rigorous stress analysis.',
  },
  {
    title: 'Durable Materials & Corrosion-Resistant Finishing',
    description:
      'High-grade structural steel with certified hot-dip galvanization, weather-resistant epoxy coatings, and marine-grade protective treatments.',
  },
  {
    title: 'Fast Delivery & Installation Efficiency',
    description:
      'Modular pre-engineered assemblies engineered for rapid on-site erection with minimal field welding, reducing turnaround time.',
  },
  {
    title: 'Long-Term Safety & Structural Performance',
    description:
      'Strict adherence to international building codes, AWS certified welding standards, and comprehensive quality assurance testing.',
  },
];

export default function FabricationDesignPage() {
  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark flex flex-col justify-between">
      <Header />

      {/* 1. HERO / INTRO SECTION */}
      <section className="relative w-full min-h-screen min-h-[100svh] xl:min-h-[580px] flex items-center justify-center pt-32 pb-20 px-4 sm:px-8 overflow-hidden bg-solix-dark">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/fabrication-hero.jpg"
            alt="E&E Fabrication & Design Infrastructure"
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
            Fabrication & Design
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed font-normal text-balance">
            At E&E Industries, our Fabrication & Design division delivers precision-engineered structural solutions for solar, commercial, and industrial applications across Pakistan. We specialize in custom steel fabrication, structural engineering, high-strength mounting systems, and cable tray systems built for durability, safety, and long-term performance. From concept and design to manufacturing and installation, we ensure every structure meets strict quality standards and project requirements.
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
              href="#services-grid"
              className="text-white/90 hover:text-white text-sm font-semibold px-7 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 transition-all"
            >
              Explore Capabilities
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE SERVICES SECTION (5-CARD 6-COLUMN STAGGERED DESKTOP GRID) */}
      <section id="services-grid" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            CORE SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Precision Structural Fabrication Services
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            End-to-end custom engineering, stress analysis, hot-dip galvanization, and on-site structural assembly.
          </p>
        </div>

        {/* 5-Card Staggered Grid (3 on Top Row, 2 Centered on Bottom Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto items-stretch">
          {FABRICATION_SERVICES.map((service, index) => {
            const Icon = service.icon;
            // Desktop 6-column span and positioning:
            // Cards 1-3: span 2 cols each (fill row 1: cols 1-2, 3-4, 5-6)
            // Card 4: span 2 cols starting at col 2 (centered between Card 1 & 2)
            // Card 5: span 2 cols starting at col 4 (centered between Card 2 & 3)
            const gridPositionClass =
              index === 3
                ? 'col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-2'
                : index === 4
                ? 'col-span-1 md:col-span-2 md:max-w-md md:mx-auto md:w-full lg:max-w-none lg:col-span-2 lg:col-start-4'
                : 'col-span-1 md:col-span-1 lg:col-span-2';

            return (
              <div
                key={service.id}
                className={`${gridPositionClass} bg-white rounded-3xl p-8 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 flex flex-col justify-between space-y-6 group h-full`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon & Category Pill */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green group-hover:bg-solix-green group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-solix-muted uppercase tracking-wider bg-solix-bg px-3 py-1 rounded-full border border-solix-border/50">
                      {service.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-solix-dark tracking-tight group-hover:text-solix-green transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SUPPORTING VALUE SECTION (BUILT FOR STRENGTH, ENGINEERED FOR RELIABILITY) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="space-y-4 mb-10 max-w-3xl">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            WHY CHOOSE E&E FABRICATION
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Built for Strength, Engineered for Reliability
          </h2>
          <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
            Why industrial enterprises, commercial developers, and solar EPC leaders trust E&E for structural fabrication and heavy steel manufacturing.
          </p>
        </div>

        {/* 2-Column Grid: 5 Benefit Cards on Left, Full-Height Visual on Right aligned with Top & Bottom Baselines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: 5 Key Value Points */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            {VALUE_POINTS.map((point) => (
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
                src="/images/service-fabrication.jpg"
                alt="E&E Structural Steel Fabrication Facility"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/90 via-solix-dark/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Certified Quality Assurance</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    Every structure is engineered with precision tolerances, ISO/AWS certified welding, and hot-dip galvanization for long-term corrosion resistance.
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
              Need custom fabrication or structural design support?
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Let&apos;s discuss your project requirements with our structural engineers and fabrication specialists.
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
              href="/projects"
              className="text-white/90 hover:text-white text-sm font-semibold px-7 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 transition-all"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
