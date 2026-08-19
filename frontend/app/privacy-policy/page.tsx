import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | E&E Industries',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix space-y-6 text-solix-dark">
          <h1 className="text-3xl font-extrabold border-b pb-4">Privacy Policy</h1>
          <p className="text-xs text-solix-muted">Last Updated: August 2026</p>

          <p className="text-sm leading-relaxed text-solix-muted">
            E&amp;E Industries (&ldquo;E&amp;E&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data. This privacy notice explains how we collect, process, and safeguard your information when you visit our website or submit inquiry forms.
          </p>

          <h3 className="text-lg font-bold">1. Information We Collect</h3>
          <p className="text-xs text-solix-muted leading-relaxed">
            We collect personal information that you voluntarily provide when requesting quotations, submitting project inquiries, or contacting engineering support, including full name, business email address, telephone number, city, and project specifications.
          </p>

          <h3 className="text-lg font-bold">2. How We Use Your Data</h3>
          <p className="text-xs text-solix-muted leading-relaxed">
            We process your information to deliver custom engineering proposals, fulfill material procurement orders, perform structural fabrication, and comply with regulatory reporting obligations.
          </p>

          <h3 className="text-lg font-bold">3. Data Security &amp; Retention</h3>
          <p className="text-xs text-solix-muted leading-relaxed">
            All customer data is encrypted in transit and at rest using industry-standard security protocols. We do not sell or lease your personal information to third parties.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
