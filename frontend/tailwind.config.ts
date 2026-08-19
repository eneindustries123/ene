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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        slideLeft: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
