'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'full' | 'symbol';
  light?: boolean;
  className?: string;
  height?: number;
}

export function BrandLogo({ variant = 'full', className, height = 36 }: BrandLogoProps) {
  if (variant === 'symbol') {
    return (
      <Link href="/" className={cn('inline-flex items-center group focus:outline-none', className)}>
        <Image
          src="/logos/symbol.png"
          alt="E&E Symbol"
          width={height}
          height={height}
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn('inline-flex items-center group focus:outline-none', className)}>
      <Image
        src="/logos/logo-full.png"
        alt="E&E Engineering & Energy"
        width={160}
        height={height}
        priority
        className="h-10 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
      />
    </Link>
  );
}
