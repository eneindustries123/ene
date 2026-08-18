'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility (Escape) & click-outside handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && servicesOpen) {
        setServicesOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [servicesOpen]);

  // Clean up any pending close timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 220); // 220ms grace window preventing accidental closes
  };

  const handleFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // If focus moves to an element outside the dropdown container, close immediately
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setServicesOpen(false);
    }
  };

  const serviceLinks = [
    { name: 'Solar Energy', href: '/solar-energy' },
    { name: 'Trading & Contracting', href: '/trading-contracting' },
    { name: 'Fabrication & Design', href: '/fabrication-design' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-3 shadow-solix-dark bg-solix-dark/95 backdrop-blur-xl border-b border-white/10'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo light />

        {/* Compact Center Navigation Pill */}
        <nav className="hidden lg:flex items-center gap-6 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 text-xs font-medium">
          <Link
            href="/"
            className={cn('transition-colors hover:text-white', pathname === '/' ? 'text-white font-bold' : 'text-white/80')}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={cn('transition-colors hover:text-white', pathname === '/about' ? 'text-white font-bold' : 'text-white/80')}
          >
            About Us
          </Link>

          {/* Services Dropdown (Shared continuous hover/focus region with invisible bridge) */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              className={cn(
                'flex items-center gap-1 transition-colors hover:text-white py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded-md',
                ['/solar-energy', '/trading-contracting', '/fabrication-design'].includes(pathname)
                  ? 'text-white font-bold'
                  : 'text-white/80'
              )}
            >
              <span>Services</span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 opacity-70 transition-transform duration-200',
                  servicesOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Dropdown Container with Seamless Hover Bridge (pt-2 creates visual space without hover gap) */}
            {servicesOpen && (
              <div
                id="services-menu"
                role="menu"
                className="absolute top-full left-0 pt-2 w-56 z-50 animate-fadeIn"
              >
                <div className="bg-solix-dark/95 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-solix-dark">
                  {serviceLinks.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                      className={cn(
                        'block px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:bg-white/15',
                        pathname === sub.href ? 'bg-solix-green text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                      )}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/projects"
            className={cn('transition-colors hover:text-white', pathname === '/projects' ? 'text-white font-bold' : 'text-white/80')}
          >
            Projects
          </Link>

          <Link
            href="/contact"
            className={cn('transition-colors hover:text-white', pathname === '/contact' ? 'text-white font-bold' : 'text-white/80')}
          >
            Contact
          </Link>
        </nav>

        {/* Visually Connected Right CTA Button */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/request-a-quote"
            className="group flex items-center gap-2.5 bg-white hover:bg-slate-100 text-solix-dark text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span>Request a Quote</span>
            <div className="w-5 h-5 rounded-full bg-solix-dark text-white flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2 rounded-full bg-white/10 backdrop-blur focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-solix-dark/95 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between border-t border-white/10 animate-fadeIn">
          <div className="space-y-4 pt-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-white hover:text-emerald-400">Home</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-white hover:text-emerald-400">About Us</Link>

            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Services</div>
              {serviceLinks.map((sub) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-white/80 hover:text-white pl-3"
                >
                  {sub.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 space-y-3">
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-white hover:text-emerald-400">Projects</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-white hover:text-emerald-400">Contact</Link>
            </div>
          </div>

          <div className="space-y-3 pb-8">
            <Link
              href="/request-a-quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-white text-solix-dark font-bold py-3.5 rounded-full text-center text-sm shadow-md"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
