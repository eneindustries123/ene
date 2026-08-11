'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'full' | 'symbol';
  light?: boolean;
  className?: string;
}

export function BrandLogo({ variant = 'full', light = false, className }: BrandLogoProps) {
  if (variant === 'symbol') {
    return (
      <Link href="/" className={cn('inline-flex items-center group focus:outline-none', className)}>
        <span className="text-2xl font-black tracking-tight text-white group-hover:scale-105 transition-transform">
          E<span className="text-emerald-400">.</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={cn('inline-flex items-center group focus:outline-none', className)}>
      <span
        className={cn(
          'text-2xl sm:text-3xl font-extrabold tracking-tight transition-transform group-hover:scale-[1.02]',
          light ? 'text-white' : 'text-solix-dark'
        )}
      >
        Electro<span className="text-emerald-400">.</span>
      </span>
    </Link>
  );
}
