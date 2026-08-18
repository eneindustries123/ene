import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        solix: {
          bg: '#F4F5F0',
          card: '#FFFFFF',
          dark: '#0B0E0C',
          darkCard: '#131815',
          text: '#121614',
          muted: '#626B66',
          lightMuted: '#95A09A',
          border: '#E2E5DE',
          green: '#16A34A',
          greenDark: '#0E5C38',
          greenHover: '#15803D',
          badge: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
        '3xl': '2rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        solix: '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'solix-lg': '0 30px 60px -20px rgba(0, 0, 0, 0.12)',
        'solix-dark': '0 30px 60px -20px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
