import React from 'react';
import { ProjectsDirectoryLoading } from '@/components/projects/ProjectsDirectoryLoading';

export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark">
      <section className="pt-36 pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <ProjectsDirectoryLoading />
      </section>
    </main>
  );
}
