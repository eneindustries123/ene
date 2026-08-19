import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  variant?: 'full' | 'symbol';
  light?: boolean;
  className?: string;
  imgClassName?: string;
}

export function BrandLogo({ variant = 'full', className, imgClassName }: BrandLogoProps) {
  if (variant === 'symbol') {
    return (
      <Link href="/" className={cn('inline-flex items-center group focus:outline-none', className)}>
        <Image
          src="/logos/symbol.png"
          alt="E&E Symbol"
          width={60}
          height={60}
          className={cn('h-11 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300', imgClassName)}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn('inline-flex items-center group focus:outline-none', className)}>
      <Image
        src="/logos/logo-full.png"
        alt="E&E Engineering & Energy"
        width={240}
        height={76}
        priority
        className={cn('h-12 sm:h-14 md:h-16 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300', imgClassName)}
      />
    </Link>
  );
}
