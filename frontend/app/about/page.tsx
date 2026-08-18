import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Sun,
  Truck,
  Hammer,
  Building2,
  Zap,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowUpRight,
  Target,
  Compass,
  Linkedin,
  Layers,
  Wrench,
  CheckCircle,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | E&E Industries',
  description:
    'Learn about E&E Industries — a premier multidisciplinary engineering enterprise specializing in solar energy EPC, industrial trading & contracting, structural fabrication, and PEB buildings.',
};

interface LeadershipMember {
  name: string;
  designation: string;
  roleBadge: string;
  summary: string;
  imageUrl: string;
  expertise: string[];
  linkedinUrl?: string;
}

const LEADERSHIP_MEMBERS: LeadershipMember[] = [
  {
    name: 'Asjed Mehnood',
    designation: 'Chief Executive Officer (CEO)',
    roleBadge: 'Executive Leadership',
    summary:
      'Steers corporate vision, strategic investment, EPC contracting, and enterprise engineering operations across solar power, procurement, and industrial infrastructure deployments.',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    expertise: [
      'Strategic Leadership',
      'EPC Project Management',
      'Renewable Energy Policy',
      'Enterprise Procurement',
    ],
    linkedinUrl: 'https://linkedin.com',
  },
  {
    name: 'Malik Waqar Ahmed',
    designation: 'Managing Director',
    roleBadge: 'Operations & Engineering',
    summary:
      'Directs engineering design standards, structural fabrication divisions, Pre-Engineered Building (PEB) solutions, and technical quality assurance across all client deployments.',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    expertise: [
      'Structural Engineering',
      'PEB & Steel Fabrication',
      'Industrial Operations',
      'Quality Assurance',
    ],
    linkedinUrl: 'https://linkedin.com',
  },
];

const CORE_CAPABILITIES = [
  {
    id: 'solar',
    title: 'Solar Energy Solutions',
    category: 'Renewable Power',
    icon: Sun,
    description:
      'Turnkey commercial, industrial, and utility-scale solar PV installations with tier-1 panels, high-efficiency inverters, and full lifecycle engineering.',
    highlights: ['Commercial Rooftop Arrays', 'Ground-Mounted Solar Farms', 'SCADA Real-Time Telemetry'],
  },
  {
    id: 'trading',
    title: 'Trading & Contracting',
    category: 'Supply Chain & EPC',
    icon: Truck,
    description:
      'Direct sourcing and reliable supply of electrical equipment, industrial materials, cable management systems, and specialized civil contracting.',
    highlights: ['Global Material Procurement', 'Electrical Hardware Supply', 'Turnkey Contracting'],
  },
  {
    id: 'fabrication',
    title: 'Fabrication & Design',
    category: 'Structural Engineering',
    icon: Hammer,
    description:
      'Heavy-duty custom structural steel fabrication, industrial mounting systems, high-mast poles, and cable trays engineered to rigorous load standards.',
    highlights: ['Custom Mounting Structures', 'High-Mast Lighting Poles', 'Industrial Cable Trays'],
  },
  {
    id: 'peb',
    title: 'Pre-Engineered Buildings (PEB)',
    category: 'Industrial Infrastructure',
    icon: Building2,
    description:
      'Cost-efficient, robust pre-engineered steel buildings, industrial warehouses, factory sheds, and elevated solar canopies designed for rapid assembly.',
    highlights: ['Factory & Warehouse Sheds', 'Elevated Solar Canopies', 'Structural Steel Framing'],
  },
  {
    id: 'net-metering',
    title: 'Net Metering & Load Management',
    category: 'Grid Integration',
    icon: Zap,
    description:
      'Complete DISCO/NEPRA regulatory approvals, bidirectional green-meter commissioning, grid synchronization, and industrial energy efficiency audits.',
    highlights: ['DISCO / NEPRA Approvals', 'Bidirectional Metering', 'Load Balancing & Audits'],
  },
];

const TRUST_PILLARS = [
  {
    title: 'Comprehensive Engineering Expertise',
    description:
      'Multidisciplinary engineering capabilities bridging photovoltaic science, civil structures, and heavy industrial electrical systems.',
  },
  {
    title: 'End-to-End EPC Project Management',
    description:
      'Single-source accountability covering feasibility, structural calculations, procurement, civil construction, and commissioning.',
  },
  {
    title: 'High-Quality Materials & Certified Suppliers',
    description:
      'Direct partnerships with global Tier-1 solar manufacturers, certified steel mills, and accredited electrical component providers.',
  },
  {
    title: 'Precision Fabrication & Structural Integrity',
    description:
      'In-house fabrication facilities ensuring customized galvanization, wind-load resilience, and adherence to international ASTM standards.',
  },
  {
    title: 'Commitment to Safety & Client Satisfaction',
    description:
      'Strict zero-harm site safety protocols, transparent warranties, and responsive long-term operations & maintenance support.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark flex flex-col justify-between">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[500px] lg:min-h-[560px] flex items-center justify-center pt-32 pb-20 px-4 sm:px-8 overflow-hidden bg-solix-dark">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/solar-hero.jpg"
            alt="E&E Industries Infrastructure"
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
            ABOUT E&E INDUSTRIES
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] text-balance">
            Engineering Reliable Solutions for a Smarter Future
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed font-normal text-balance">
            E&E Industries is a multidisciplinary engineering enterprise delivering high-yield solar energy EPC, technical trading & contracting, precision steel fabrication, and industrial infrastructure across Pakistan.
          </p>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
              WHO WE ARE
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
              Experienced Engineers & Technical Specialists
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-solix-muted leading-relaxed">
              <p>
                Founded on the principles of engineering integrity and operational excellence, E&E Industries brings together a seasoned team of engineers, project managers, and technical specialists dedicated to executing complex commercial and industrial infrastructure projects.
              </p>
              <p>
                We provide end-to-end EPC (Engineering, Procurement, and Construction) services—from initial feasibility studies and structural load calculations to turnkey installation, grid synchronization, and post-commissioning maintenance.
              </p>
              <p>
                Whether accelerating commercial energy transitions through advanced solar arrays or engineering custom pre-engineered steel buildings and structural mounts, we deliver tailored, high-performing solutions engineered for long-term reliability.
              </p>
            </div>

            {/* Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white rounded-2xl p-4 border border-solix-border/80 shadow-sm">
                <div className="text-2xl font-extrabold text-solix-dark">10+ Years</div>
                <div className="text-xs text-solix-muted mt-0.5">Engineering Track Record</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-solix-border/80 shadow-sm">
                <div className="text-2xl font-extrabold text-solix-dark">50MW</div>
                <div className="text-xs text-solix-muted mt-0.5">Annual Solar Capacity</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-solix-border/80 shadow-sm col-span-2 sm:col-span-1">
                <div className="text-2xl font-extrabold text-solix-green">100%</div>
                <div className="text-xs text-solix-muted mt-0.5">Turnkey Execution</div>
              </div>
            </div>
          </div>

          {/* Right: Supporting Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-solix-lg border border-solix-border aspect-[4/3] sm:aspect-[4/3] lg:aspect-[5/4]">
              <Image
                src="/images/solar-engineer-tablet.jpg"
                alt="E&E Engineering Specialist on Site"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  On-Site Execution
                </div>
                <div className="text-sm font-bold">
                  Certified Engineers Ensuring Strict Quality & Safety Standards
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE CAPABILITIES / WHAT WE DO */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            CORE CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Integrated Multi-Disciplinary Services
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            Delivering end-to-end engineering excellence from concept design to operational commissioning.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className="bg-white rounded-3xl p-8 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green group-hover:bg-solix-green group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-solix-muted uppercase tracking-wider bg-solix-bg px-3 py-1 rounded-full border border-solix-border/50">
                      {cap.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-solix-dark tracking-tight group-hover:text-solix-green transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-solix-border/50 space-y-2">
                  {cap.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-medium text-solix-dark/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-solix-green shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MISSION & VISION (PERMANENT EDITORIAL SECTION) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Editorial Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-solix-border/70 pb-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
              OUR PURPOSE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
              Engineering Progress With Purpose
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
              At E&E Industries, engineering is more than construction—it is a disciplined commitment to dependable energy efficiency, rigorous structural integrity, sustainable industrial development, and creating measurable, enduring value for our clients.
            </p>
          </div>
        </div>

        {/* Two-Column Mission & Vision Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MISSION */}
          <div className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-solix-border/80 shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between space-y-8 group">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-solix-border/50 pb-4">
                <span className="text-xs font-bold text-solix-green tracking-widest uppercase">
                  MISSION
                </span>
                <div className="w-8 h-8 rounded-full bg-solix-bg border border-solix-border flex items-center justify-center text-solix-dark">
                  <Target className="w-4 h-4 text-solix-green" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-solix-dark tracking-tight leading-snug">
                Building Reliable Solutions for Today
              </h3>

              <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
                To deliver reliable, cost-effective energy, engineering, trading, contracting, and fabrication solutions that create measurable value for our clients while supporting sustainable industrial growth across all sectors.
              </p>
            </div>

            <div className="pt-6 border-t border-solix-border/50 flex items-center justify-between text-xs text-solix-muted font-medium">
              <span>Practical Engineering & Execution</span>
              <span className="text-solix-green font-bold flex items-center gap-1">
                Measurable Client Value
              </span>
            </div>
          </div>

          {/* VISION */}
          <div className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-solix-border/80 shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between space-y-8 group">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-solix-border/50 pb-4">
                <span className="text-xs font-bold text-solix-green tracking-widest uppercase">
                  VISION
                </span>
                <div className="w-8 h-8 rounded-full bg-solix-bg border border-solix-border flex items-center justify-center text-solix-dark">
                  <Compass className="w-4 h-4 text-solix-green" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-solix-dark tracking-tight leading-snug">
                Engineering a Smarter, Sustainable Future
              </h3>

              <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
                To become a recognized engineering and energy solutions partner celebrated for uncompromised safety, technological agility, dependable execution, and sustainable infrastructure development.
              </p>
            </div>

            <div className="pt-6 border-t border-solix-border/50 flex items-center justify-between text-xs text-solix-muted font-medium">
              <span>Leadership & Innovation</span>
              <span className="text-solix-green font-bold flex items-center gap-1">
                Long-Term Partnership
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MANAGEMENT COMMITTEE MEMBERS */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            LEADERSHIP & GOVERNANCE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Management Committee
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            Guiding E&E Industries with decades of combined engineering, structural, and executive operational leadership.
          </p>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {LEADERSHIP_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-solix-border/80 shadow-solix hover:shadow-solix-lg transition-all duration-300 flex flex-col justify-between space-y-8 group"
            >
              {/* Profile Top Block */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Portrait Photo */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-md border border-solix-border/80">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="128px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Name, Role & Details */}
                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-solix-bg border border-solix-border text-[11px] font-bold text-solix-green uppercase tracking-wider">
                    {member.roleBadge}
                  </div>
                  <h3 className="text-2xl font-extrabold text-solix-dark tracking-tight">
                    {member.name}
                  </h3>
                  <div className="text-xs font-bold text-solix-muted">
                    {member.designation}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                {member.summary}
              </p>

              {/* Expertise Tags */}
              <div className="space-y-3 pt-4 border-t border-solix-border/50">
                <div className="text-[11px] font-bold text-solix-dark uppercase tracking-wider">
                  Core Expertise
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 rounded-full bg-solix-bg border border-solix-border/80 text-[11px] font-semibold text-solix-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Optional LinkedIn Button */}
              {member.linkedinUrl && (
                <div className="pt-2 flex justify-end">
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-solix-muted hover:text-[#0A66C2] transition-colors"
                    aria-label={`${member.name} LinkedIn Profile`}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CLIENTS TRUST E&E */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Trust Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
                WHY CHOOSE E&E
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
                Built on Integrity, Engineered for Performance
              </h2>
              <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
                Why industrial leaders, commercial enterprises, and institutions trust E&E for their mission-critical infrastructure.
              </p>
            </div>

            {/* 5 Key Pillars */}
            <div className="space-y-4">
              {TRUST_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl p-5 border border-solix-border/80 shadow-sm flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-solix-green flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-solix-dark">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-solix-muted leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Clean Supporting Image Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-solix-lg border border-solix-border aspect-[4/5]">
              <Image
                src="/images/why-ee-panoramic.jpg"
                alt="E&E Solar Installation Infrastructure"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/85 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Uncompromised Standards</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    Fully compliant with international engineering benchmarks, rigorous load testing, and certified safety codes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl sm:rounded-4xl p-8 sm:p-14 border border-white/10 shadow-solix-dark relative overflow-hidden text-center space-y-6">
          {/* Subtle Background Glow Accent */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-white/5">
              START YOUR PROJECT
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Have a project in mind?
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Connect with our senior engineering team to discuss commercial solar deployment, structural steel fabrication, or technical procurement requirements for your enterprise.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="group flex items-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Contact Us</span>
              <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>

            <Link
              href="/request-a-quote"
              className="text-white/90 hover:text-white text-sm font-semibold px-7 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 transition-all"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
