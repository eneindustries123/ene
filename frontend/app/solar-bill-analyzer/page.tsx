import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SolarBillAnalyzer } from '@/components/solar-analyzer/SolarBillAnalyzer';

export const metadata: Metadata = {
  title: 'Solar Bill Analyzer Pakistan',
  description:
    'Upload your Pakistani electricity bill and compare preliminary On-Grid, Hybrid, and Off-Grid solar recommendations based on verified monthly consumption.',
};

export default function SolarBillAnalyzerPage() {
  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark flex flex-col justify-between">
      <Header />
      <section className="pt-36 pb-20 px-4 sm:px-8 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-5 mb-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-solix-border bg-white text-solix-green text-xs font-extrabold uppercase tracking-widest">
            Pakistan Solar Recommendation Tool
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            Turn your electricity bill into a practical solar starting point
          </h1>
          <p className="text-sm sm:text-lg text-solix-muted max-w-3xl mx-auto leading-relaxed">
            Upload one bill, verify the twelve-month usage history, and compare preliminary On-Grid, Hybrid, and Off-Grid recommendations for your Pakistani city.
          </p>
        </div>
        <SolarBillAnalyzer />
      </section>
      <Footer />
    </main>
  );
}
