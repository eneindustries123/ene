import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INITIAL_PROJECTS } from '@/lib/data';
import { ArrowUpRight, MapPin, Zap, Calendar, UserCheck } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = INITIAL_PROJECTS.find((p) => p.slug === params.slug) || INITIAL_PROJECTS[0];
  return {
    title: `${project.title} | Case Study Solix`,
    description: project.summary,
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = INITIAL_PROJECTS.find((p) => p.slug === params.slug) || INITIAL_PROJECTS[0];
  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Banner */}
        <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-solix mb-12 border border-solix-border">
          <Image
            src={project.mainImage}
            alt={project.title}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/80 via-solix-dark/30 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
            <div className="inline-block bg-solix-green text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              {project.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Project Meta Metrics Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-solix-border shadow-solix mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs font-bold text-solix-muted flex items-center gap-1.5 mb-1">
              <UserCheck className="w-4 h-4 text-solix-green" /> Client
            </div>
            <div className="text-sm font-extrabold text-solix-dark">{project.client}</div>
          </div>

          <div>
            <div className="text-xs font-bold text-solix-muted flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4 text-solix-green" /> Location
            </div>
            <div className="text-sm font-extrabold text-solix-dark">{project.location}</div>
          </div>

          <div>
            <div className="text-xs font-bold text-solix-muted flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-amber-500" /> Rated Capacity
            </div>
            <div className="text-sm font-extrabold text-solix-dark">{project.capacity}</div>
          </div>

          <div>
            <div className="text-xs font-bold text-solix-muted flex items-center gap-1.5 mb-1">
              <Calendar className="w-4 h-4 text-solix-green" /> Commissioned
            </div>
            <div className="text-sm font-extrabold text-solix-dark">{project.completionYear}</div>
          </div>
        </div>

        {/* Case Study Content */}
        <div className="max-w-4xl mx-auto space-y-8 bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix">
          <h2 className="text-2xl font-bold text-solix-dark border-b border-solix-border pb-4">
            Project Overview & Engineering Scope
          </h2>

          <p className="text-base text-solix-muted leading-relaxed">
            {project.fullStory}
          </p>

          <div className="pt-4 border-t border-solix-border/50 flex justify-between items-center">
            <span className="text-xs text-solix-muted">Interested in similar capacity deployments?</span>
            <Link
              href="/request-a-quote"
              className="flex items-center gap-2 bg-solix-dark text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-black transition-colors"
            >
              <span>Consult Engineering Team</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
