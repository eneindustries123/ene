import React from 'react';

export function ProjectsDirectoryLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-12">
      <p className="h-10 flex items-center justify-center text-sm font-semibold text-solix-muted">
        Loading projects…
      </p>
      <div aria-hidden="true" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[0, 1, 2].map((card) => (
          <div key={card} className="bg-white rounded-3xl p-6 border border-solix-border/80 space-y-6">
            <div className="aspect-[4/3] rounded-2xl bg-solix-bg" />
            <div className="h-4 w-2/3 rounded bg-solix-bg" />
            <div className="h-16 rounded bg-solix-bg" />
            <div className="h-12 rounded-full bg-solix-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}
