import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#1e293b',
      },
      keyframes: {
        slideInFromLeft: {
          from: { transform: 'translateX(6%)', opacity: '0' },
          to:   { transform: 'translateX(0)',  opacity: '1' },
        },
        slideInFromRight: {
          from: { transform: 'translateX(-6%)', opacity: '0' },
          to:   { transform: 'translateX(0)',   opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.96)', opacity: '0' },
          to:   { transform: 'scale(1)',    opacity: '1' },
        },
      },
      animation: {
        'slide-in-left':  'slideInFromLeft 0.22s ease',
        'slide-in-right': 'slideInFromRight 0.22s ease',
        'slide-up':       'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in':        'fadeIn 0.2s ease',
        'scale-in':       'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
