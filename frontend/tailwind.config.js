/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
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
        orange: {
          400: '#f07030',
          500: '#e85d1a',
          600: '#c44d14',
          700: '#a03d10',
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
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      backgroundImage: {
        'grid-subtle': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'gradient-dark': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        'gradient-orange': 'linear-gradient(135deg, #e85d1a 0%, #c44d14 100%)',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232, 93, 26, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(232, 93, 26, 0.3)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.4)',
        'orange-glow': '0 0 24px rgba(232, 93, 26, 0.4)',
        'green-glow': '0 0 12px rgba(34, 197, 126, 0.3)',
      },
    },
  },
  plugins: [],
}
