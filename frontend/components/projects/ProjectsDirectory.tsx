'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Zap, Layers, Sparkles, Building2, Sun } from 'lucide-react';
import { Project } from '@/lib/data';

interface ProjectsDirectoryProps {
  initialProjects: Project[];
}

export function ProjectsDirectory({ initialProjects }: ProjectsDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract available categories
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'solar', label: 'Solar Energy', filter: (p: Project) => p.category.toLowerCase().includes('solar') },
    { id: 'commercial', label: 'Commercial & Logistics', filter: (p: Project) => p.category.toLowerCase().includes('commercial') || p.category.toLowerCase().includes('logistics') },
    { id: 'fabrication', label: 'Fabrication & Infrastructure', filter: (p: Project) => p.category.toLowerCase().includes('fabrication') || p.category.toLowerCase().includes('infrastructure') },
  ];

  const filteredProjects = initialProjects.filter((p) => {
    if (selectedCategory === 'all') return true;
    const cat = categories.find((c) => c.id === selectedCategory);
    return cat && cat.filter ? cat.filter(p) : true;
  });

  return (
    <div className="space-y-12">
      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-solix-dark text-white shadow-md'
                : 'bg-white text-solix-muted border border-solix-border/80 hover:text-solix-dark hover:border-solix-dark/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {filteredProjects.map((project) => (
          <div
            key={project.id || project.slug}
            className="bg-white rounded-3xl p-6 border border-solix-border/80 shadow-solix hover:shadow-solix-lg hover:border-solix-green/30 transition-all duration-300 flex flex-col justify-between space-y-6 group h-full"
          >
            <div className="space-y-5">
              {/* Image Preview & Category Badge */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-solix-bg">
                <Image
                  src={project.mainImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-solix-dark/40 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3">
                  <span className="bg-solix-dark/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/10">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Location & Capacity Strip */}
              <div className="flex items-center justify-between text-xs font-medium text-solix-muted border-b border-solix-border/60 pb-3.5">
                <div className="flex items-center gap-1.5 truncate max-w-[55%]">
                  <MapPin className="w-3.5 h-3.5 text-solix-green shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate max-w-[42%] font-bold text-solix-dark">
                  <Zap className="w-3.5 h-3.5 text-solix-green shrink-0" />
                  <span className="truncate">{project.capacity}</span>
                </div>
              </div>

              {/* Title & Summary */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-solix-dark group-hover:text-solix-green transition-colors leading-snug line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-solix-muted leading-relaxed line-clamp-3">
                  {project.summary}
                </p>
              </div>
            </div>

            {/* Read Case Study Button */}
            <div className="pt-2">
              <Link
                href={`/projects/${project.slug}`}
                className="group/btn w-full flex items-center justify-center gap-2.5 bg-solix-dark hover:bg-black text-white text-xs font-bold py-3.5 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>Read Case Study</span>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center text-solix-muted text-sm border border-solix-border">
          No projects found in this category.
        </div>
      )}
    </div>
  );
}
