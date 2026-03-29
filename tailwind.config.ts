import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
  presets: [require('@medusajs/ui-preset')],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 6s infinite',
        orbit: 'orbit 2s linear forwards infinite',
        orbit2: 'orbit2 5s linear reverse infinite',
        orbit3: 'orbit3 7s linear forwards infinite',
        orbit4: 'orbit4 9s linear reverse infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 90%, 100%': {
            'background-position': 'calc(-100% - var(--shimmer-width)) 0',
          },
          '30%, 60%': {
            'background-position': 'calc(100% + var(--shimmer-width)) 0',
          },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbit2: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbit3: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbit4: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      typography: {
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config
