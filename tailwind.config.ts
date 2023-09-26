/** @type {import('tailwindcss').Config} */
import { blue, red } from '@radix-ui/colors';

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        hover: 'hsl(var(--hover))',

        accent: 'hsl(var(--accent))',
        accentAzure: 'hsl(var(--accentAzure))',
        accentSkyBlue: 'hsl(var(--accentSkyBlue))',

        confirmative: 'hsl(var(--confirmative))',
        destructive: 'hsl(var(--destructive))',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        paragraph: 'hsl(var(--paragraph))',

        blue: 'hsl(var(--blue))',
        pink: 'hsl(var(--pink))',
        green: 'hsl(var(--green))',
        red: 'hsl(var(--red))',
        orange: 'hsl(var(--orange))',
        purple: 'hsl(var(--purple))',

        darkBlue: 'hsl(var(--dark-blue))',
        darkPink: 'hsl(var(--dark-pink))',
        darkGreen: 'hsl(var(--dark-green))',
        darkRed: 'hsl(var(--dark-red))',
        darkOrange: 'hsl(var(--dark-orange))',
        darkPurple: 'hsl(var(--dark-purple))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
