import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { COMMITTEE_MEMBERS } from '@/lib/data';
import { ShieldCheck, Award, Globe2, Users, ArrowUpRight, Cpu, Layers, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us | Electro',
  description: 'Learn about Electro, our Executive Management Committee (Asjed Mehnood & Malik Waqar Ahmed), 10-year engineering track record, and multi-service capabilities.',
};

export default function AboutPage() {
  const capabilities = [
    'Solar Energy & Net Metering',
    'EPC & General Contracting',
    'Trading & Technical Procurement',
    'Fabrication & Structural Design',
    'PEB Buildings & Steel Structures',
  ];

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            About Electro
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Engineering Solutions. Built on Experience.
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            Electro brings together engineering, renewable energy, procurement, contracting, structural design, and fabrication expertise to deliver practical solutions for complex project requirements.
          </p>
        </div>
      </section>

      {/* Capability Blocks */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {capabilities.map((cap) => (
            <div key={cap} className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-solix-green mx-auto" />
              <div className="text-xs font-bold text-solix-dark">{cap}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Executive Committee Members */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white mb-3">
            Leadership
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-solix-dark tracking-tight">Executive Management Committee</h2>
          <p className="text-xs text-solix-muted mt-2">Guiding Electro engineering precision and strategic project delivery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {COMMITTEE_MEMBERS.map((member) => (
            <div key={member.name} className="bg-white rounded-3xl p-8 border border-solix-border shadow-solix flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-md">
                <Image src={member.imageUrl} alt={member.name} fill className="object-cover object-center" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-bold text-solix-dark">{member.name}</h3>
                <div className="text-xs font-bold text-solix-green">{member.role}</div>
                <p className="text-xs text-solix-muted leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl p-8 sm:p-14 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-solix-dark border border-white/10">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Our Mission</span>
            <h3 className="text-2xl font-bold">Engineering Quality & Technical Reliability</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              To provide technically reliable, efficient, and practical engineering solutions across solar energy, procurement, and fabrication that create lasting value for our commercial and industrial clients.
            </p>
          </div>

          <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/20 pt-8 md:pt-0 md:pl-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Our Vision</span>
            <h3 className="text-2xl font-bold">Trusted Infrastructure Partner</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              To become a trusted engineering and energy solutions partner recognized for uncompromised quality, technical capability, and responsible project execution across Pakistan and international markets.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
