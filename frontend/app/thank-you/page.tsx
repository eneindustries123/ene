import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Submission Received | Solix Renewable Energy',
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-44 pb-28 px-4 sm:px-8 max-w-xl mx-auto w-full text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <h1 className="text-3xl font-extrabold text-solix-dark">
            Thank You for Your Request
          </h1>

          <p className="text-sm text-solix-muted leading-relaxed">
            Your quotation request has been dispatched to our senior engineering team. A technical representative will review your project parameters and contact you within 24 hours.
          </p>

          <div className="pt-4 border-t border-solix-border/50">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-solix-dark text-white text-xs font-bold px-6 py-3.5 rounded-full hover:bg-black transition-colors"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
