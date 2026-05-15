/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '390px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        charcoal: {
          950: '#050505',
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#242424',
          600: '#2e2e2e',
          500: '#3a3a3a',
          400: '#4a4a4a',
        },
        bone: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f0ebe0',
          300: '#e5ddd0',
          400: '#d4c8b8',
          500: '#b8a898',
        },
        // Brand cyan/teal — keyed under `orange` so legacy `*-orange-*` utility classes pick up the new brand
        // without a sweeping rename. Hues sampled from the bridge in the Peninsula Pick Ups logo.
        orange: {
          400: '#5eead4',
          500: '#14b8a6',
          600: '#0e7490',
          700: '#155e75',
        },
        // Banner red sampled from the "Peninsula Pick Ups" banner.
        'brand-red': {
          400: '#d44a4a',
          500: '#b03030',
          600: '#8a2424',
        },
        // Star/accent gold sampled from the logo's flourishes.
        'brand-gold': {
          300: '#f5d97a',
          400: '#e8c25a',
          500: '#c89a3a',
        },
        steel: {
          200: '#c8d0da',
          300: '#b0bac6',
          400: '#8a96a8',
          500: '#6b7585',
          600: '#515d6e',
        },
        verify: {
          400: '#4ade90',
          500: '#22c57e',
          600: '#18a065',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      backgroundImage: {
        'grid-subtle': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'gradient-dark': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        'gradient-orange': 'linear-gradient(135deg, #14b8a6 0%, #155e75 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(20, 184, 166, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(20, 184, 166, 0.3)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.4)',
        'orange-glow': '0 0 24px rgba(20, 184, 166, 0.4)',
        'green-glow': '0 0 12px rgba(34, 197, 126, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
}
