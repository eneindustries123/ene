import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getPublishedProjects } from '@/lib/projects-store';
import { ProjectsDirectory } from '@/components/projects/ProjectsDirectory';
import { ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Projects & Case Studies | E&E Industries',
  description:
    'Explore engineered clean energy deployments, custom solar mounting structures, commercial hybrid microgrids, and industrial infrastructure delivered across Pakistan by E&E Industries.',
};

export const revalidate = 60; // ISR revalidate every 60 seconds

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark flex flex-col justify-between">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="pt-36 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center px-4 py-1 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white">
            ENGINEERING PORTFOLIO
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-solix-dark tracking-tight leading-[1.12] text-balance">
            Pioneering Energy & Structural Deployments Across Pakistan
          </h1>

          <p className="text-base sm:text-lg text-solix-muted leading-relaxed font-normal text-balance">
            Explore our proven track record of turnkey solar EPC installations, custom structural steel fabrication, and reliable industrial procurement across commercial, industrial, institutional, and infrastructure sectors.
          </p>
        </div>
      </section>

      {/* 2. DYNAMIC PUBLISHED PROJECTS DIRECTORY */}
      <section className="pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <ProjectsDirectory initialProjects={projects} />
      </section>

      {/* 3. FINAL PROJECT ENQUIRY / QUOTE CTA */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl sm:rounded-4xl p-8 sm:p-14 border border-white/10 shadow-solix-dark relative overflow-hidden text-center space-y-6">
          {/* Background Glow Accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1 rounded-full border border-white/20 text-emerald-400 text-xs font-bold uppercase tracking-widest bg-white/5">
              START YOUR PROJECT
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to power or engineer your next project?
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Consult with E&E Industries&apos; engineering team for turnkey solar EPC, structural steel fabrication, or technical procurement.
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
