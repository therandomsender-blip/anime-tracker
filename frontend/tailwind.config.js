/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0d0d14',
          50: '#f0f0f5',
          100: '#d8d8e8',
          800: '#1a1a2e',
          900: '#0d0d14',
        },
        sakura: {
          DEFAULT: '#ff6b9d',
          light: '#ffb3cc',
          dark: '#cc4477',
        },
        gold: {
          DEFAULT: '#ffd700',
          muted: '#c9a227',
        },
        cyan: {
          anime: '#00d4ff',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 107, 157, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(255, 107, 157, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
