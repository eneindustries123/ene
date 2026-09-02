'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function BlogsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog route error', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col justify-between bg-solix-bg">
      <Header />
      <section className="mx-auto w-full max-w-xl px-4 pb-28 pt-44 text-center sm:px-8">
        <div className="space-y-6 rounded-3xl border border-solix-border bg-white p-8 shadow-solix sm:p-12">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-600" aria-hidden="true" />
          <h1 className="text-3xl font-extrabold text-solix-dark">Unable to load this insight</h1>
          <p className="text-sm leading-6 text-solix-muted">
            The publishing service is temporarily unavailable. You can retry now or return to all
            insights.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-solix-dark px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-solix-green"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </button>
            <Link
              href="/blogs"
              className="inline-flex min-h-11 items-center rounded-full border border-solix-border px-6 py-3 text-sm font-bold text-solix-dark transition-colors hover:bg-solix-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-solix-green"
            >
              All Insights
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

