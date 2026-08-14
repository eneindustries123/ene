'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Facebook, Instagram, Youtube, Linkedin, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

// Custom TikTok SVG Icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .58.04.85.12V9.33a6.33 6.33 0 00-1-.08 6.34 6.34 0 106.34 6.34V8.71a8.21 8.21 0 004.92 1.6V6.87a4.86 4.86 0 01-1-.18z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-solix-dark text-white rounded-3xl sm:rounded-4xl p-8 sm:p-14 space-y-14 shadow-solix-dark border border-white/10">
        {/* Top Header Row: Brand & Business Consultation Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start justify-between border-b border-white/10 pb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-6 space-y-4">
            <BrandLogo light />
            <p className="text-xs sm:text-sm text-white/70 max-w-md leading-relaxed">
              E&E provides integrated solar energy, trading and contracting, and fabrication and design solutions for residential, commercial, industrial, and infrastructure projects.
            </p>
          </div>

          {/* Business Consultation Banner */}
          <div className="lg:col-span-6 bg-white/10 rounded-2xl p-6 border border-white/15 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-solix-green text-white flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Talk to Our Engineering Team</h4>
                <p className="text-xs text-white/70">Get a detailed technical evaluation or custom project estimate.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 bg-white text-solix-dark hover:bg-slate-200 text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md"
              >
                <span>Request a Project Estimate</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>

              <Link
                href="/contact"
                className="text-xs text-white/80 hover:text-white font-semibold underline underline-offset-4 px-3 py-2"
              >
                Contact Technical Support
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Column Directory Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/10 pb-12 text-xs">
          {/* Column 1: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link href="/solar-energy" className="hover:text-white transition-colors">Solar Energy</Link></li>
              <li><Link href="/trading-contracting" className="hover:text-white transition-colors">Trading & Contracting</Link></li>
              <li><Link href="/fabrication-design" className="hover:text-white transition-colors">Fabrication & Design</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/request-a-quote" className="hover:text-white transition-colors">Request a Quote</Link></li>
            </ul>
          </div>

          {/* Column 3: Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Address :</span>
            </h4>
            <p className="text-white/80 leading-relaxed font-medium">
              183B Iqbal Avenue 1<br />
              Lahore, Pakistan
            </p>
          </div>

          {/* Column 4: Contact & Social Pages */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact</h4>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="mailto:marketing@eneindustries.com" className="hover:text-white transition-colors">
                  marketing@eneindustries.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="mailto:sales@eneindustries.com" className="hover:text-white transition-colors">
                  sales@eneindustries.com
                </a>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:03063999363" className="text-base font-extrabold text-white hover:text-emerald-400 transition-colors">
                  03063999363
                </a>
              </div>
            </div>

            {/* Social Media Links under Contact Section */}
            <div className="pt-2">
              <span className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-2">Connect With Us</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="E&E on Facebook"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-solix-green text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="E&E on Instagram"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-solix-green text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="E&E on YouTube"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-solix-green text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="E&E on TikTok"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-solix-green text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="E&E on LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-solix-green text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} E&E. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
