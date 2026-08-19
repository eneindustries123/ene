import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Sun,
  Home,
  Building2,
  Factory,
  Sprout,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Zap,
  ShieldCheck,
  Award,
  FileText,
  Activity,
  Layers,
  Settings,
  BatteryCharging,
  Cpu,
  CheckCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Solar Energy Solutions | E&E Industries',
  description:
    'Complete solar EPC, installation, commissioning, and turnkey net-metering solutions for residential, commercial, industrial, and agricultural applications across Pakistan.',
};

// 1. Sector Capabilities Data
const SECTOR_SOLUTIONS = [
  {
    id: 'residential',
    title: 'Residential Solar',
    category: 'Home Energy',
    icon: Home,
    description:
      'High-efficiency rooftop solar systems engineered for modern homes and villas, providing reliable backup and drastic utility bill reductions.',
    features: [
      'Turnkey Net Metering Integration',
      'Hybrid Battery Backup Options',
      'Smart Mobile Cloud Monitoring',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Solar',
    category: 'Enterprise & Retail',
    icon: Building2,
    description:
      'Turnkey solar arrays for corporate offices, retail hubs, shopping centers, educational institutes, and hospitals to optimize daytime operational costs.',
    features: [
      'Peak Demand & Tariff Shaving',
      'Zero-Export & Grid Synchronization',
      'Custom Elevated Solar Canopies',
    ],
  },
  {
    id: 'industrial',
    title: 'Industrial Solar',
    category: 'Manufacturing Plants',
    icon: Factory,
    description:
      'High-capacity multi-hundred kilowatt and megawatt solar plants engineered for heavy continuous motor loads, textile mills, and manufacturing plants.',
    features: [
      'Heavy Motor Load Balancing',
      'High-Voltage Grid Synchronization',
      'SCADA Telemetry & Remote Analytics',
    ],
  },
  {
    id: 'agricultural',
    title: 'Agricultural Solar',
    category: 'Farms & Tubewells',
    icon: Sprout,
    description:
      'Rugged solar pumping solutions for tubewells, water filtration, irrigation networks, and remote farms with zero reliance on diesel generators.',
    features: [
      'VFD Solar Tubewell Drives',
      'Off-Grid Irrigation Autonomy',
      'Heavy Galvanized Rural Mounts',
    ],
  },
];

// 2. End-to-End EPC Process Steps
const EPC_STEPS = [
  {
    number: '01',
    title: 'Site Assessment',
    description: '3D shadow analysis, structural load evaluation, and solar irradiance mapping.',
  },
  {
    number: '02',
    title: 'Engineering & Design',
    description: 'Precision CAD layout, single-line diagrams (SLDs), and electrical string engineering.',
  },
  {
    number: '03',
    title: 'Procurement',
    description: 'Direct sourcing of Tier-1 solar modules, European inverters, and certified DC switchgear.',
  },
  {
    number: '04',
    title: 'Installation',
    description: 'In-house certified technical teams erecting custom mounting structures and DC/AC cabling.',
  },
  {
    number: '05',
    title: 'Testing',
    description: 'String Voc/Isc checks, insulation resistance verification, and earthing pit testing.',
  },
  {
    number: '06',
    title: 'Commissioning',
    description: 'Automated inverter synchronization, safety relay checks, and live load energization.',
  },
  {
    number: '07',
    title: 'Net Metering',
    description: 'Full DISCO regulatory coordination, green bidirectional meter installation, and activation.',
  },
];

// 3. System Configurations Data
const SYSTEM_CONFIGURATIONS = [
  {
    id: 'on-grid',
    title: 'On-Grid System (Grid-Tied)',
    tag: 'Highest Financial Return',
    howItWorks:
      'Directly synchronized with the utility grid. Solar power is consumed by your appliances during the daytime, and all excess units are automatically exported to the grid through Net Metering credits.',
    bestSuitedFor:
      'Urban residences, commercial offices, hospitals, and industrial facilities with reliable grid connectivity seeking maximum energy cost reduction.',
    keyAdvantage:
      'Lowest capital cost per watt, highest financial ROI, and complete elimination of peak daytime electricity bills with zero battery maintenance.',
  },
  {
    id: 'hybrid',
    title: 'Hybrid System (Dual-Mode)',
    tag: 'Zero Downtime & Backup',
    howItWorks:
      'Combines grid-tied net metering with advanced lithium or tubular battery storage. Powers daytime loads, stores surplus energy in batteries for load shedding, and exports extra units to the grid.',
    bestSuitedFor:
      'Modern homes, corporate data hubs, clinics, and manufacturing setups in areas experiencing load shedding where uninterrupted power is essential.',
    keyAdvantage:
      'Seamless UPS-grade instantaneous power backup during grid outages combined with active net metering credits and intelligent battery lifecycle management.',
  },
  {
    id: 'off-grid',
    title: 'Off-Grid System (Standalone)',
    tag: '100% Energy Autonomy',
    howItWorks:
      'Operates completely independently of the national electrical grid. All electricity is generated by solar panels, stored in high-capacity battery banks, and converted via off-grid inverters.',
    bestSuitedFor:
      'Remote agricultural farms, rural water tubewells, remote housing, telecommunication towers, and facilities located far from utility grid infrastructure.',
    keyAdvantage:
      'Total freedom from utility grid power lines, complete immunity against tariff increases, and reliable 24/7 power in off-grid rural territories.',
  },
];

// 4. Solar Packages Data (Clean Practical Structure without fake appliance counts)
const SOLAR_PACKAGES = [
  {
    capacity: '10KW Solar System',
    badge: 'Residential / Light Commercial',
    monthlyGeneration: '1,200 – 1,400 Units / Month',
    idealFor: 'Large residential homes, executive villas & commercial shops',
    configuration: 'On-Grid or Hybrid with Net Metering',
    useCase: 'Full household energy offset, daytime air conditioning, water pumping & grid export credits',
    quoteParam: '10kw',
  },
  {
    capacity: '15KW Solar System',
    badge: 'Commercial / Executive Estate',
    monthlyGeneration: '1,800 – 2,100 Units / Month',
    idealFor: 'Commercial outlets, multi-story buildings, clinics & large estates',
    configuration: 'On-Grid or Hybrid with Net Metering',
    useCase: 'Substantial commercial daytime load management, multi-zone HVAC, refrigeration & peak tariff reduction',
    quoteParam: '15kw',
    popular: true,
  },
  {
    capacity: '20KW Solar System',
    badge: 'Industrial / Corporate Plaza',
    monthlyGeneration: '2,400 – 2,800 Units / Month',
    idealFor: 'Small-to-medium factories, corporate plazas, educational institutes & warehouses',
    configuration: 'On-Grid or Hybrid with High-Voltage Inverters',
    useCase: 'High-capacity industrial daytime self-consumption, heavy machinery support & high-volume bulk export',
    quoteParam: '20kw',
  },
];

// 5. Net Metering Features Data
const NET_METERING_POINTS = [
  {
    title: 'DISCO & Regulatory Coordination',
    description: 'End-to-end processing with LESCO, FESCO, IESCO, GEPCO, MEPCO, PESCO, and K-Electric.',
  },
  {
    title: 'Bidirectional Green Metering',
    description: 'Procurement, testing, and installation of certified bidirectional meters for accurate import/export logging.',
  },
  {
    title: 'Grid Synchronization & Protection',
    description: 'Advanced anti-islanding protection relays, earthing certification, and frequency tolerance compliance.',
  },
  {
    title: 'Complete Technical Documentation',
    description: 'Preparation of single-line diagrams (SLDs), structural stability certificates, and NEPRA license filings.',
  },
  {
    title: 'Official Inspection & Commissioning',
    description: 'Coordination of official DISCO engineering team site inspections and live meter commissioning.',
  },
];

// 6. Why Choose E&E Strengths
const SOLAR_TRUST_PILLARS = [
  {
    title: 'End-to-End EPC Capability',
    description: 'Single-source accountability from initial feasibility and structural mounting to grid activation and lifetime O&M.',
    icon: Layers,
  },
  {
    title: 'Engineering-Led Design',
    description: 'Precision CAD modeling, 3D solar irradiance simulation, and customized wind-load structural engineering.',
    icon: Cpu,
  },
  {
    title: 'Quality Equipment Sourcing',
    description: 'Direct procurement of Tier-1 solar modules (Longi, JA Solar, Canadian Solar, Jinko) and European-standard inverters.',
    icon: Award,
  },
  {
    title: 'Professional Commissioning',
    description: 'Certified electrical engineers ensuring strict adherence to NEPRA standards, IEC safety codes, and rigorous testing.',
    icon: ShieldCheck,
  },
];

export default function SolarEnergyPage() {
  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark flex flex-col justify-between">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen min-h-[100svh] xl:min-h-[580px] flex items-center justify-center pt-32 pb-20 px-4 sm:px-8 overflow-hidden bg-solix-dark">
        {/* Background Image & Cinematic Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/solar-hero.jpg"
            alt="E&E Solar Energy Infrastructure"
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
            SOLAR ENERGY
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] text-balance">
            Solar Solutions Engineered for Long-Term Performance
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-3xl mx-auto leading-relaxed font-normal text-balance">
            E&E Industries provides complete end-to-end solar EPC, precision installation, high-yield commissioning, and turnkey net-metering support across Pakistan for residential, commercial, industrial, and agricultural sectors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/request-a-quote"
              className="group flex items-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Request a Solar Assessment</span>
              <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>

            <Link
              href="#configurations"
              className="text-white/90 hover:text-white text-sm font-semibold px-7 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 transition-all"
            >
              Explore Systems
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SOLAR SOLUTIONS BY SECTOR (4 EQUAL CARDS) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            SECTOR SOLUTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Tailored Solar Systems by Sector
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            Purpose-built solar photovoltaic architectures engineered for specific load profiles and operational requirements.
          </p>
        </div>

        {/* 4 Equal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SECTOR_SOLUTIONS.map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.id}
                className="bg-white rounded-3xl p-7 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green group-hover:bg-solix-green group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-solix-muted uppercase tracking-wider bg-solix-bg px-2.5 py-1 rounded-full border border-solix-border/50">
                      {sector.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-solix-dark tracking-tight group-hover:text-solix-green transition-colors">
                    {sector.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-solix-border/50 space-y-2">
                  {sector.features.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-medium text-solix-dark/85">
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

      {/* 3. END-TO-END SOLAR EPC (PROCESS SECTION) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-14 border border-white/10 shadow-solix-dark space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-white/5">
              EPC WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              End-to-End Solar Project Execution
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              From initial site feasibility to final DISCO grid synchronization, E&E delivers single-source EPC accountability with strict quality control.
            </p>
          </div>

          {/* Desktop Horizontal Process Flow (7 Steps) */}
          <div className="hidden lg:grid lg:grid-cols-7 gap-3 relative">
            {EPC_STEPS.map((step, idx) => (
              <div key={step.number} className="relative flex flex-col justify-between space-y-4 group">
                {/* Step Pill & Connector Line */}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-xs font-extrabold shrink-0">
                    {step.number}
                  </span>
                  <div className="h-[2px] w-full bg-white/15" />
                </div>

                {/* Step Card Content */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex-1 flex flex-col justify-start space-y-2 hover:bg-white/10 transition-colors">
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Responsive Vertical / Grid Version for Mobile & Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:hidden gap-4">
            {EPC_STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-xs font-extrabold">
                    {step.number}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Step {step.number}</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLAR SYSTEM CONFIGURATIONS (3 DEDICATED CARDS) */}
      <section id="configurations" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            SYSTEM ARCHITECTURES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Engineered Solar System Configurations
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            Select the optimal electrical configuration suited for your local grid availability and energy independence goals.
          </p>
        </div>

        {/* 3 Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {SYSTEM_CONFIGURATIONS.map((config) => (
            <div
              key={config.id}
              className="bg-white rounded-3xl p-8 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 flex flex-col justify-between space-y-6 group h-full"
            >
              <div className="space-y-5 flex-1 flex flex-col justify-start">
                {/* Header Badge & Title */}
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-solix-bg border border-solix-border text-[11px] font-bold text-solix-green uppercase tracking-wider">
                    {config.tag}
                  </span>
                  <h3 className="text-2xl font-extrabold text-solix-dark tracking-tight group-hover:text-solix-green transition-colors">
                    {config.title}
                  </h3>
                </div>

                {/* How it Works */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-solix-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-solix-green" />
                    <span>How It Works</span>
                  </div>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                    {config.howItWorks}
                  </p>
                </div>

                {/* Best Suited For */}
                <div className="space-y-1.5 pt-3 border-t border-solix-border/50">
                  <div className="text-xs font-bold text-solix-dark uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-solix-green" />
                    <span>Best Suited For</span>
                  </div>
                  <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
                    {config.bestSuitedFor}
                  </p>
                </div>
              </div>

              {/* Key Advantage Box (Equal height on desktop) */}
              <div className="bg-solix-bg rounded-2xl p-4 border border-solix-border/80 space-y-1 w-full lg:min-h-[132px] flex flex-col justify-start">
                <div className="text-[11px] font-extrabold text-solix-green uppercase tracking-wider">
                  Key Advantage
                </div>
                <p className="text-xs text-solix-dark font-medium leading-relaxed">
                  {config.keyAdvantage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SOLAR SYSTEM PACKAGES (10KW, 15KW, 20KW) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            STANDARD PACKAGES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Turnkey Solar System Packages
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            Engineered packages optimized for standard residential, commercial, and light-industrial power requirements.
          </p>
        </div>

        {/* 3 Packages Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SOLAR_PACKAGES.map((pkg) => (
            <div
              key={pkg.capacity}
              className={`bg-white rounded-3xl p-8 border ${
                pkg.popular
                  ? 'border-solix-green ring-2 ring-solix-green/20 shadow-solix-lg'
                  : 'border-solix-border/80 shadow-solix'
              } hover:shadow-solix-lg transition-all duration-300 flex flex-col justify-between space-y-6 relative group`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-solix-green text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-solix-muted uppercase tracking-wider bg-solix-bg px-3 py-1 rounded-full border border-solix-border/50">
                    {pkg.badge}
                  </span>
                  <h3 className="text-2xl font-extrabold text-solix-dark tracking-tight">
                    {pkg.capacity}
                  </h3>
                </div>

                {/* Estimated Monthly Generation Strip */}
                <div className="bg-solix-bg rounded-2xl p-4 border border-solix-border/80 space-y-1">
                  <div className="text-[11px] font-bold text-solix-muted uppercase tracking-wider">
                    Estimated Generation
                  </div>
                  <div className="text-lg font-extrabold text-solix-green">
                    {pkg.monthlyGeneration}
                  </div>
                </div>

                {/* Practical Specifications */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-solix-dark block mb-0.5">Ideal Application:</span>
                    <span className="text-solix-muted leading-relaxed">{pkg.idealFor}</span>
                  </div>

                  <div className="pt-2 border-t border-solix-border/50">
                    <span className="font-bold text-solix-dark block mb-0.5">Available Configuration:</span>
                    <span className="text-solix-muted leading-relaxed">{pkg.configuration}</span>
                  </div>

                  <div className="pt-2 border-t border-solix-border/50">
                    <span className="font-bold text-solix-dark block mb-0.5">General Use Case:</span>
                    <span className="text-solix-muted leading-relaxed">{pkg.useCase}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/request-a-quote?system=${pkg.quoteParam}`}
                className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-3.5 rounded-full transition-all duration-200 ${
                  pkg.popular
                    ? 'bg-solix-green hover:bg-emerald-600 text-white shadow-md'
                    : 'bg-solix-dark hover:bg-black text-white'
                }`}
              >
                <span>Get System Assessment</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NET METERING & GRID INTEGRATION (ENGINEERING-FOCUSED SECTION) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left: Net Metering Information */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
                GRID INTEGRATION
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
                Turnkey Net Metering & Regulatory Coordination
              </h2>
              <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
                Under NEPRA Alternative & Renewable Energy regulations, Net Metering allows you to sell excess generated solar units back to the national grid, turning your electricity meter into a financial credit revenue stream.
              </p>
            </div>

            {/* 5 Regulatory & Technical Pillars */}
            <div className="space-y-3.5">
              {NET_METERING_POINTS.map((point) => (
                <div
                  key={point.title}
                  className="bg-white rounded-2xl p-5 border border-solix-border/80 shadow-sm flex items-start gap-4 hover:border-solix-green/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-solix-green flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4.5 h-4.5 text-solix-green" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-solix-dark leading-snug">
                      {point.title}
                    </h3>
                    <p className="text-xs text-solix-muted leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Net Metering Visual Infographic Card (Aligned to match left column height) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-solix-dark text-white rounded-3xl p-8 sm:p-10 border border-white/10 shadow-solix-dark relative overflow-hidden flex flex-col justify-between h-full space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    How Net Metering Works
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Bidirectional Energy Banking
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                    During high-irradiance daytime hours, your solar system powers your facility and exports excess surplus units to the DISCO grid. At night or during cloudy periods, you draw grid power offset against your exported credits.
                  </p>
                </div>

                {/* Key Benefits Metric Rows */}
                <div className="space-y-4 pt-4 border-t border-white/15">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs font-bold text-white">Export Unit Value</div>
                    <div className="text-xs font-extrabold text-emerald-400">1 : 1 Offsetting Credits</div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs font-bold text-white">Bill Reduction</div>
                    <div className="text-xs font-extrabold text-emerald-400">Up to 90% – 100%</div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs font-bold text-white">Approval Turnaround</div>
                    <div className="text-xs font-extrabold text-emerald-400">Full E&E Handling</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/request-a-quote"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-solix-dark text-xs font-bold py-3.5 rounded-full transition-colors shadow-md"
                >
                  <span>Check Your Net Metering Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE E&E FOR SOLAR (CONCISE 4-PILLAR TRUST SECTION) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            THE E&E ADVANTAGE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-solix-dark tracking-tight">
            Why Choose E&E for Solar
          </h2>
          <p className="text-sm sm:text-base text-solix-muted">
            Engineering excellence, tier-1 component standards, and dedicated lifecycle support across all installations.
          </p>
        </div>

        {/* 4 Key Strengths Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLAR_TRUST_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-7 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green group-hover:bg-solix-green group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-solix-dark tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-solix-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl sm:rounded-4xl p-8 sm:p-14 border border-white/10 shadow-solix-dark relative overflow-hidden text-center space-y-6">
          {/* Subtle Background Glow Accent */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-white/5">
              GET STARTED
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to Reduce Your Energy Costs?
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Connect with our senior solar engineers to discuss custom residential, commercial, industrial, or agricultural solar power systems tailored to your energy demands.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/request-a-quote"
              className="group flex items-center gap-3 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Request a Solar Assessment</span>
              <div className="w-7 h-7 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>

            <Link
              href="/contact"
              className="text-white/90 hover:text-white text-sm font-semibold px-7 py-3.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
