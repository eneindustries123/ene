import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-44 pb-28 px-4 sm:px-8 max-w-xl mx-auto w-full text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 stroke-[2.5]" />
          </div>

          <h1 className="text-4xl font-extrabold text-solix-dark">404 - Page Not Found</h1>

          <p className="text-sm text-solix-muted leading-relaxed">
            The clean energy resource or requested route could not be located. It may have been moved or updated.
          </p>

          <div className="pt-4 border-t border-solix-border/50">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-solix-dark text-white text-xs font-bold px-6 py-3.5 rounded-full hover:bg-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to E&E Homepage</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
