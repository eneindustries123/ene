import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Download, ExternalLink, FileText, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'E&E Industries Company Profile | Engineering & Energy Solutions',
  description:
    'View and download the official E&E Industries company profile covering solar energy, engineering, trading, contracting, fabrication, and project capabilities.',
};

export default function CompanyProfilePage() {
  const pdfUrl = '/documents/ee-industries-company-profile.pdf';

  return (
    <main className="min-h-screen bg-solix-bg text-solix-dark flex flex-col justify-between">
      <Header />

      {/* 1. HERO / INTRO SECTION */}
      <section className="pt-36 pb-12 px-4 sm:px-8 max-w-5xl mx-auto w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-solix-border text-solix-green text-xs font-bold uppercase tracking-widest bg-white shadow-sm">
          <FileText className="w-3.5 h-3.5" />
          <span>COMPANY PROFILE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-solix-dark tracking-tight leading-[1.12] text-balance">
          Engineering Capability. Proven Execution.
        </h1>

        <p className="text-base sm:text-lg text-solix-muted max-w-3xl mx-auto leading-relaxed font-normal text-balance">
          Explore E&amp;E Industries&rsquo; engineering capabilities, solar energy solutions, trading and contracting expertise, fabrication services, and project experience through our official company profile.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={pdfUrl}
            download="ee-industries-company-profile.pdf"
            className="group inline-flex items-center justify-center gap-3 bg-solix-dark hover:bg-black text-white font-semibold text-sm h-13 sm:h-14 px-7 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
            <span>Download Company Profile</span>
          </a>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-solix-dark font-semibold text-sm h-13 sm:h-14 px-7 rounded-full border border-solix-border/80 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          >
            <span>Open PDF</span>
            <ExternalLink className="w-4 h-4 text-solix-muted" />
          </a>
        </div>
      </section>

      {/* 2. EMBEDDED PDF VIEWER SECTION */}
      <section className="pb-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-3xl sm:rounded-4xl border border-solix-border/80 shadow-solix-lg p-4 sm:p-6 space-y-4">
          {/* Top Viewer Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2 py-1 border-b border-solix-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-solix-green flex items-center justify-center shrink-0 border border-emerald-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-solix-dark">
                  E&amp;E Industries Official Company Profile
                </h2>
                <p className="text-xs text-solix-muted">
                  Official Corporate &amp; Engineering Document • PDF
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-solix-bg hover:bg-slate-200 text-solix-dark transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </a>

              <a
                href={pdfUrl}
                download="ee-industries-company-profile.pdf"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-solix-green hover:bg-emerald-700 text-white transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>

          {/* Mobile Direct Access Helper Note */}
          <div className="block lg:hidden bg-solix-bg rounded-2xl p-4 border border-solix-border/60 text-xs text-solix-muted space-y-2">
            <p className="leading-relaxed">
              <strong className="text-solix-dark">Mobile Viewing Tip:</strong> If your browser does not render the embedded document viewer below, use the <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-solix-green font-bold underline">Open PDF</a> or <a href={pdfUrl} download="ee-industries-company-profile.pdf" className="text-solix-green font-bold underline">Download PDF</a> buttons for full high-resolution viewing.
            </p>
          </div>

          {/* Native Embedded PDF Frame */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-solix-border/40">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title="E&E Industries Official Company Profile PDF"
              className="w-full h-[550px] sm:h-[700px] lg:h-[82vh] border-0"
            />
          </div>
        </div>
      </section>

      {/* 3. BOTTOM SUMMARY / NEXT STEP CTA */}
      <section className="pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-solix-dark text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-solix-dark flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold uppercase tracking-widest border border-emerald-500/30">
              TAKE THE NEXT STEP
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to collaborate on your next project?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl">
              Discuss your project parameters with E&amp;E Industries&rsquo; engineering team for custom solar EPC, fabrication, or procurement solutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-100 text-solix-dark font-bold text-xs px-6 py-3.5 rounded-full transition-all shadow-md"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="text-xs font-semibold px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
