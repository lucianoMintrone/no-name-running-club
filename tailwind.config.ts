import type { Config } from 'tailwindcss';

/**
 * NNRC Tailwind Configuration
 * Extends Tailwind CSS with No Name Running Club brand tokens
 */

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nnrc: {
          // Primary Purple - Darker for better contrast
          purple: {
            DEFAULT: '#8B7AAF',
            dark: '#5C4D7A',
            light: '#B8A8D4',
          },
          // Accent Lavender - Lightened for better backgrounds
          lavender: {
            DEFAULT: '#E5DCF0',
            dark: '#D2C5E0',
            light: '#F5F1FA',
          },
          // Temperature Scale
          temp: {
            'extreme-cold': '#3B82F6',
            'very-cold': '#6366F1',
            'cold': '#8B5CF6',
            'cool': '#A78BFA',
            'mild': '#C4B5FD',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'purple-sm': '0 1px 3px 0 rgba(169, 153, 198, 0.1)',
        'purple-md': '0 4px 6px -1px rgba(169, 153, 198, 0.15)',
        'purple-lg': '0 10px 15px -3px rgba(169, 153, 198, 0.2)',
      },
      animation: {
        'fadeIn': 'fadeIn 200ms ease-out',
        'slideUp': 'slideUp 300ms ease-out',
        'slideDown': 'slideDown 300ms ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
