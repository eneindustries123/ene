import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { OverlappingMetrics } from '@/components/sections/OverlappingMetrics';
import { MissionVision } from '@/components/sections/MissionVision';
import { CoreExpertise } from '@/components/sections/CoreExpertise';
import { TechnologySpotlight } from '@/components/sections/TechnologySpotlight';
import { PartnersShowcase } from '@/components/sections/PartnersShowcase';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { GetInTouchForm } from '@/components/sections/GetInTouchForm';
import { Footer } from '@/components/layout/Footer';
import { isProductionBuild } from '@/lib/api-client';
import {
  fetchPublishedProjectsFromApi,
  selectHomepageProjects,
} from '@/lib/projects-store';
import type { Project } from '@/lib/data';

export default async function HomePage() {
  let featuredProjects: Project[] = [];
  let projectsLoadFailed = false;

  try {
    const publishedProjects = await fetchPublishedProjectsFromApi();
    featuredProjects = selectHomepageProjects(publishedProjects);
  } catch (error) {
    const reason = error instanceof Error && error.name === 'AbortError'
      ? 'timed out'
      : 'failed';
    const preserveCachedHomepage = process.env.NODE_ENV === 'production' && !isProductionBuild();
    console.warn(
      `[homepage] Published projects request ${reason}; ${preserveCachedHomepage ? 'preserving cached homepage' : 'rendering without project cards'}.`
    );

    if (preserveCachedHomepage) {
      throw new Error('Published projects unavailable during homepage regeneration.');
    }

    projectsLoadFailed = true;
  }

  return (
    <main className="min-h-screen bg-solix-bg overflow-hidden flex flex-col justify-between">
      {/* 1. Header */}
      <Header />

      {/* 2. Hero (3 Service States) */}
      <Hero />

      {/* 3. Integrated Stats Section */}
      <OverlappingMetrics />

      {/* 4. Mission & Vision Section */}
      <MissionVision />

      {/* 5. Core Engineering Services */}
      <CoreExpertise />

      {/* 6. Solar Highlight Section */}
      <TechnologySpotlight />

      {/* 7. Technology Partners Showcase */}
      <PartnersShowcase />

      {/* 8. Why E&E */}
      <WhyChooseUs />

      {/* 9. Featured Projects */}
      <FeaturedProjects projects={featuredProjects} loadFailed={projectsLoadFailed} />

      {/* 10. Testimonials / Client Proof */}
      <TestimonialsSection />

      {/* 11. Short Contact / Lead Capture CTA */}
      <GetInTouchForm />

      {/* 12. Footer */}
      <Footer />
    </main>
  );
}
