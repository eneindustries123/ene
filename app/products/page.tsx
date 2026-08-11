import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Products & Solutions | Solix Renewable Energy',
  description: 'Explore high-efficiency monocrystalline solar arrays, utility wind turbines, and smart battery storage microgrid systems.',
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            Clean Energy Solutions
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-solix-dark tracking-tight leading-tight">
            High-Performance Renewable Hardware
          </h1>
          <p className="text-base sm:text-lg text-solix-muted leading-relaxed">
            Engineered to industry-leading standards, our solar, wind, and storage systems empower enterprises to achieve complete energy independence.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-solix-border shadow-solix hover:shadow-solix-lg transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-6">
                {/* Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-solix-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-solix-dark group-hover:text-solix-green transition-colors mb-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-solix-muted leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Key Features List */}
                <div className="space-y-2 pt-2 border-t border-solix-border/50">
                  {product.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs font-medium text-solix-dark">
                      <CheckCircle2 className="w-3.5 h-3.5 text-solix-green shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Link
                  href={`/products/${product.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-solix-dark hover:bg-black text-white text-xs font-semibold py-3 rounded-full transition-colors"
                >
                  <span>View Product Details</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
