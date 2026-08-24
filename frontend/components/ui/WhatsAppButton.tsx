'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

// Custom WhatsApp SVG Icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const pathname = usePathname();

  // Hide WhatsApp floating button on all admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/project-admin')) {
    return null;
  }

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with E&E Industries on WhatsApp"
      className="fixed z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#111714] text-[#22C76A] hover:bg-[#22C76A] hover:text-white border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_36px_rgba(34,199,106,0.30)] hover:scale-[1.04] active:scale-95 transition-all duration-200 ease-out flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C76A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111714]"
      style={{
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
        right: 'calc(1.25rem + env(safe-area-inset-right, 0px))',
      }}
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 transition-colors duration-200" />
    </a>
  );
}
