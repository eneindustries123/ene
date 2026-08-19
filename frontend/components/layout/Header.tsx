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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // Initially collapsed
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll detection for header elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change & reset services state
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Keyboard accessibility (Escape) & click-outside handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          setMobileServicesOpen(false);
        }
        if (servicesOpen) setServicesOpen(false);
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
  }, [mobileMenuOpen, servicesOpen]);

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
    }, 220); // 220ms grace window
  };

  const handleFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setServicesOpen(false);
    }
  };

  const serviceLinks = [
    { name: 'Solar Energy', href: '/solar-energy', desc: 'Commercial, industrial, and residential solar EPC' },
    { name: 'Trading & Contracting', href: '/trading-contracting', desc: 'Material procurement, electrical equipment & EPC' },
    { name: 'Fabrication & Design', href: '/fabrication-design', desc: 'Precision steel structures, PEB buildings & mounts' },
  ];

  const isServiceActive = ['/solar-energy', '/trading-contracting', '/fabrication-design'].includes(pathname);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 py-3 border-b border-white/10 shadow-solix-dark',
          isScrolled ? 'bg-solix-dark/95 backdrop-blur-xl' : 'bg-solix-dark/90 backdrop-blur-md'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="shrink-0">
            <BrandLogo light />
          </div>

          {/* Desktop Navigation Center Pill */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-6 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 text-xs font-medium"
          >
            <Link
              href="/"
              className={cn(
                'transition-colors hover:text-white',
                pathname === '/' ? 'text-white font-bold' : 'text-white/80'
              )}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={cn(
                'transition-colors hover:text-white',
                pathname === '/about' ? 'text-white font-bold' : 'text-white/80'
              )}
            >
              About Us
            </Link>

            {/* Desktop Services Dropdown */}
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
                aria-controls="services-menu-desktop"
                className={cn(
                  'flex items-center gap-1 transition-colors hover:text-white py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded-md',
                  isServiceActive ? 'text-white font-bold' : 'text-white/80'
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

              {servicesOpen && (
                <div
                  id="services-menu-desktop"
                  role="menu"
                  className="absolute top-full left-0 pt-2 w-64 z-50 animate-fadeIn"
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
                          pathname === sub.href
                            ? 'bg-solix-green text-white font-bold'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
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
              className={cn(
                'transition-colors hover:text-white',
                pathname === '/projects' || pathname.startsWith('/projects/')
                  ? 'text-white font-bold'
                  : 'text-white/80'
              )}
            >
              Projects
            </Link>

            <Link
              href="/contact"
              className={cn(
                'transition-colors hover:text-white',
                pathname === '/contact' ? 'text-white font-bold' : 'text-white/80'
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Action */}
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

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => {
                if (!prev) setMobileServicesOpen(false);
                return !prev;
              })
            }
            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="lg:hidden text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="lg:hidden fixed inset-0 z-50 flex justify-end"
        >
          {/* Backdrop */}
          <div
            onClick={closeMobile}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-sm sm:max-w-md h-[100dvh] bg-solix-dark text-white border-l border-white/10 shadow-2xl flex flex-col z-10 animate-slideLeft">
            {/* 1. Drawer Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-solix-dark/95 shrink-0">
              <BrandLogo light />
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close navigation"
                className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 overscroll-contain">
              {/* Primary Navigation Links */}
              <nav aria-label="Mobile Menu Links" className="space-y-1">
                <Link
                  href="/"
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-colors',
                    pathname === '/'
                      ? 'bg-solix-green text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span>Home</span>
                </Link>

                <Link
                  href="/about"
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-colors',
                    pathname === '/about'
                      ? 'bg-solix-green text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span>About Us</span>
                </Link>

                {/* Services Collapsible Accordion */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-colors',
                      isServiceActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-emerald-400 transition-transform duration-200',
                        mobileServicesOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div className="mt-1 ml-3 pl-3 border-l-2 border-emerald-500/30 space-y-1 animate-fadeIn">
                      {serviceLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={closeMobile}
                          className={cn(
                            'block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                            pathname === sub.href
                              ? 'bg-solix-green text-white font-bold'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          )}
                        >
                          <div>{sub.name}</div>
                          <div className="text-[11px] text-white/50 leading-tight mt-0.5 truncate">
                            {sub.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/projects"
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-colors',
                    pathname === '/projects' || pathname.startsWith('/projects/')
                      ? 'bg-solix-green text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span>Projects</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-colors',
                    pathname === '/contact'
                      ? 'bg-solix-green text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span>Contact</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
