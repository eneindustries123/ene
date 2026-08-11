import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { OverlappingMetrics } from '@/components/sections/OverlappingMetrics';
import { CoreExpertise } from '@/components/sections/CoreExpertise';
import { TechnologySpotlight } from '@/components/sections/TechnologySpotlight';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { GetInTouchForm } from '@/components/sections/GetInTouchForm';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-solix-bg overflow-hidden flex flex-col justify-between">
      {/* 1. Header */}
      <Header />

      {/* 2. Hero */}
      <Hero />

      {/* 3. Integrated Stats Section */}
      <OverlappingMetrics />

      {/* 4. Core Services */}
      <CoreExpertise />

      {/* 5. Solar Highlight Section */}
      <TechnologySpotlight />

      {/* 6. Why Electro */}
      <WhyChooseUs />

      {/* 7. Featured Projects */}
      <FeaturedProjects />

      {/* 8. Testimonials / Client Proof */}
      <TestimonialsSection />

      {/* 9. Short Contact / Lead Capture CTA */}
      <GetInTouchForm />

      {/* 10. Footer */}
      <Footer />
    </main>
  );
}
