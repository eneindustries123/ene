import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Electro | Engineering, Solar Energy, Trading & Fabrication',
    template: '%s | Electro',
  },
  description: 'Electro is an integrated engineering, renewable energy, procurement, contracting, fabrication, and structural design organization.',
  keywords: ['Electro', 'Solar Energy Pakistan', 'Trading & Contracting', 'Fabrication & Design', 'PEB Buildings', 'Solar Mounting Structures', 'Net Metering'],
  authors: [{ name: 'Electro' }],
  creator: 'Electro',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eneindustries.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eneindustries.com',
    title: 'Electro | Engineering, Solar Energy, Trading & Fabrication',
    description: 'Integrated solar energy, trading and contracting, and fabrication and design solutions for residential, commercial, industrial, and infrastructure projects.',
    siteName: 'Electro',
    images: [
      {
        url: '/images/service-solar.jpg',
        width: 1200,
        height: 630,
        alt: 'Electro Engineering & Solar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electro | Engineering & Energy',
    description: 'Smarter energy and infrastructure solutions across solar, trading, and fabrication.',
    images: ['/images/service-solar.jpg'],
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-solix-bg text-solix-text antialiased selection:bg-solix-green selection:text-white">
        {children}
      </body>
    </html>
  );
}
