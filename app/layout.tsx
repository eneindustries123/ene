import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'E&E | Engineering, Solar Energy, Trading & Fabrication',
    template: '%s | E&E',
  },
  description: 'E&E is an integrated engineering, renewable energy, procurement, contracting, fabrication, and structural design organization.',
  keywords: ['E&E', 'E&E Industries', 'Solar Energy Pakistan', 'Trading & Contracting', 'Fabrication & Design', 'PEB Buildings', 'Solar Mounting Structures', 'Net Metering'],
  authors: [{ name: 'E&E' }],
  creator: 'E&E',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eneindustries.com'),
  icons: {
    icon: [
      { url: '/logos/symbol.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logos/symbol.png',
    apple: '/logos/symbol.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eneindustries.com',
    title: 'E&E | Engineering, Solar Energy, Trading & Fabrication',
    description: 'Integrated solar energy, trading and contracting, and fabrication and design solutions for residential, commercial, industrial, and infrastructure projects.',
    siteName: 'E&E',
    images: [
      {
        url: '/logos/symbol.png',
        width: 600,
        height: 600,
        alt: 'E&E Engineering & Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E&E | Engineering & Energy',
    description: 'Smarter energy and infrastructure solutions across solar, trading, and fabrication.',
    images: ['/logos/symbol.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} scroll-smooth`}>
      <head>
        <link rel="icon" type="image/png" href="/logos/symbol.png" />
        <link rel="apple-touch-icon" href="/logos/symbol.png" />
      </head>
      <body className="bg-solix-bg text-solix-text antialiased selection:bg-solix-green selection:text-white">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
