import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INITIAL_PROJECTS } from '@/lib/data';
import { ArrowUpRight, MapPin, Zap, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Projects & Case Studies | Solix Renewable Energy',
  description: 'Explore utility-scale wind farms, desert solar microgrids, and commercial zero-carbon energy developments delivered worldwide.',
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            Global Portfolio
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            Pioneering Clean Energy Deployments
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            Discover how Solix partners with utility companies, commercial enterprises, and municipal authorities across North America, Europe, and Asia.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-6 border border-solix-border shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={project.mainImage}
                    alt={project.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-solix-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                    {project.category}
                  </div>
                </div>

                {/* Info Bar */}
                <div className="flex items-center justify-between text-xs font-medium text-solix-muted border-b border-solix-border/40 pb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-solix-green" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{project.capacity}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-solix-dark group-hover:text-solix-green transition-colors leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-solix-muted leading-relaxed line-clamp-3">
                  {project.summary}
                </p>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-solix-dark hover:bg-black text-white text-xs font-semibold py-3 rounded-full transition-colors"
                >
                  <span>Read Case Study</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
