import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms & Conditions | E&E Industries',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix space-y-6 text-solix-dark">
          <h1 className="text-3xl font-extrabold border-b pb-4">Terms &amp; Conditions</h1>
          <p className="text-xs text-solix-muted">Last Updated: August 2026</p>

          <p className="text-sm leading-relaxed text-solix-muted">
            By accessing or using the E&amp;E Industries website or inquiry portal, you agree to be bound by these Terms and Conditions.
          </p>

          <h3 className="text-lg font-bold">1. Intellectual Property</h3>
          <p className="text-xs text-solix-muted leading-relaxed">
            All engineering content, CAD layouts, technical specifications, branding assets, and documentation displayed on this website are the property of E&amp;E Industries and protected by applicable copyright and commercial laws.
          </p>

          <h3 className="text-lg font-bold">2. Technical Estimates &amp; Proposals</h3>
          <p className="text-xs text-solix-muted leading-relaxed">
            Provisional estimates generated through website inquiry forms are for preliminary planning purposes. Formal engineering designs and commercial warranties are binding only upon execution of an official contract.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
