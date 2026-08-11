import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Download, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug) || INITIAL_PRODUCTS[0];
  return {
    title: `${product.title} | Solix Renewable Energy`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug) || INITIAL_PRODUCTS[0];
  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Image */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-solix border border-solix-border">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-solix-dark text-white text-xs font-bold px-4 py-1.5 rounded-full">
                {product.category}
              </div>
            </div>

            {/* Certifications Badge row */}
            <div className="bg-white rounded-2xl p-6 border border-solix-border flex items-center justify-around text-center">
              <div>
                <ShieldCheck className="w-6 h-6 text-solix-green mx-auto mb-1" />
                <div className="text-xs font-bold text-solix-dark">ISO 9001 Certified</div>
              </div>
              <div className="w-px h-8 bg-solix-border" />
              <div>
                <Zap className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <div className="text-xs font-bold text-solix-dark">UL 9540A Safety</div>
              </div>
              <div className="w-px h-8 bg-solix-border" />
              <div>
                <ShieldCheck className="w-6 h-6 text-solix-green mx-auto mb-1" />
                <div className="text-xs font-bold text-solix-dark">25-Yr Performance Warranty</div>
              </div>
            </div>
          </div>

          {/* Right Column Details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-solix-dark tracking-tight leading-tight">
                {product.title}
              </h1>
              <p className="text-sm sm:text-base text-solix-muted leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-solix-border shadow-solix space-y-4">
              <h3 className="text-lg font-bold text-solix-dark border-b border-solix-border pb-3">
                Technical Specifications
              </h3>
              <div className="space-y-3 text-sm">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-solix-border/40 last:border-0">
                    <span className="text-solix-muted font-medium">{key}</span>
                    <span className="font-bold text-solix-dark">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-solix-dark">Key Engineering Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-solix-dark bg-white p-3 rounded-xl border border-solix-border">
                    <CheckCircle2 className="w-4 h-4 text-solix-green shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/request-a-quote"
                className="flex items-center gap-3 bg-solix-dark hover:bg-black text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all shadow-md"
              >
                <span>Request Custom Quotation</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <button
                type="button"
                className="flex items-center gap-2 border border-solix-border hover:border-solix-dark text-solix-dark text-xs font-bold px-5 py-3.5 rounded-full transition-colors bg-white"
              >
                <Download className="w-4 h-4" />
                <span>Datasheet PDF</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
