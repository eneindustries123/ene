import Link from 'next/link';
import { ArrowUpRight, Calculator, Sparkles } from 'lucide-react';

type BlogSolarAnalyzerCTAProps = {
  variant?: 'inline' | 'primary';
  className?: string;
};

export function BlogSolarAnalyzerCTA({
  variant = 'inline',
  className = '',
}: BlogSolarAnalyzerCTAProps) {
  const targetRoute = '/solar-bill-analyzer';

  if (variant === 'inline') {
    return (
      <aside
        className={`my-10 overflow-hidden rounded-2xl border border-solix-border/50 bg-solix-dark p-6 text-white shadow-solix-lg sm:rounded-3xl sm:p-7 ${className}`}
        aria-label="Solar Bill Analyzer recommendation"
      >
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/15 text-emerald-400"
              aria-hidden="true"
            >
              <Calculator className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold leading-snug tracking-tight text-white sm:text-xl">
                Wondering What Solar System Fits Your Electricity Bill?
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/75 sm:text-sm">
                Upload your electricity bill and get a personalized solar recommendation based on
                your actual usage.
              </p>
            </div>
          </div>

          <Link
            href={targetRoute}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-solix-green px-6 py-3 text-xs font-bold text-white transition-colors duration-200 hover:bg-solix-greenDark sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-solix-dark"
          >
            <span>Analyze My Electricity Bill</span>
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`relative my-12 overflow-hidden rounded-3xl border border-white/10 bg-solix-dark p-8 text-white shadow-solix-dark sm:rounded-4xl sm:p-10 ${className}`}
      aria-label="Solar Bill Analyzer call to action"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
          SOLAR BILL ANALYZER
        </span>

        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Find the Right Solar System for Your Electricity Bill
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          Get a personalized solar recommendation based on your electricity usage and current
          bill.
        </p>

        <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <Link
            href={targetRoute}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-solix-green px-7 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-solix-greenDark focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-solix-dark"
          >
            <span>Analyze My Electricity Bill</span>
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            Free • Takes only a few minutes
          </span>
        </div>
      </div>
    </aside>
  );
}
