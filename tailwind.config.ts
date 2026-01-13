import type { Config } from 'tailwindcss';

/**
 * NNRC Tailwind Configuration
 * Extends Tailwind CSS with No Name Running Club brand tokens
 * 
 * Design Philosophy: Modern fitness app aesthetic
 * - Clean backgrounds with bold accent colors
 * - Shadow-based elevation system
 * - Large hero metrics with expressive typography
 * - Smooth micro-animations for delightful interactions
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
          // Primary Indigo - Modern, energetic, high contrast
          purple: {
            DEFAULT: '#6366F1',
            dark: '#4F46E5',
            light: '#818CF8',
            50: '#EEF2FF',
            100: '#E0E7FF',
          },
          // Accent Slate - Clean, professional backgrounds
          lavender: {
            DEFAULT: '#F1F5F9',
            dark: '#E2E8F0',
            light: '#F8FAFC',
          },
          // Temperature Scale - Vibrant gradients
          temp: {
            'extreme-cold': '#0EA5E9',
            'very-cold': '#3B82F6',
            'cold': '#6366F1',
            'cool': '#8B5CF6',
            'mild': '#A78BFA',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // Hero metrics - large, bold numbers
        'hero-sm': ['2.5rem', { lineHeight: '1', fontWeight: '800' }],
        'hero': ['3.5rem', { lineHeight: '1', fontWeight: '900' }],
        'hero-lg': ['4.5rem', { lineHeight: '1', fontWeight: '900' }],
        'hero-xl': ['6rem', { lineHeight: '1', fontWeight: '900' }],
      },
      boxShadow: {
        // Modern elevation system
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.06), 0 12px 28px rgba(0, 0, 0, 0.06)',
        'card-active': '0 2px 8px rgba(0, 0, 0, 0.08)',
        // Brand shadows with indigo tint
        'purple-sm': '0 1px 3px 0 rgba(99, 102, 241, 0.08)',
        'purple-md': '0 4px 12px -2px rgba(99, 102, 241, 0.12)',
        'purple-lg': '0 8px 24px -4px rgba(99, 102, 241, 0.16)',
        // Glow effects
        'glow-sm': '0 0 12px rgba(99, 102, 241, 0.15)',
        'glow-md': '0 0 20px rgba(99, 102, 241, 0.2)',
        'glow-lg': '0 0 32px rgba(99, 102, 241, 0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'gradient-surface': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        'gradient-hero': 'linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)',
        'gradient-cold': 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      },
      animation: {
        'fadeIn': 'fadeIn 150ms ease-out',
        'fadeInUp': 'fadeInUp 200ms ease-out',
        'fadeInDown': 'fadeInDown 200ms ease-out',
        'slideUp': 'slideUp 250ms ease-out',
        'slideDown': 'slideDown 250ms ease-out',
        'scaleIn': 'scaleIn 150ms ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 400ms ease-out',
        'lift': 'lift 150ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounceSubtle: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        lift: {
          '0%': { transform: 'translateY(0)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px rgba(0, 0, 0, 0.04)' },
          '100%': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06), 0 12px 28px rgba(0, 0, 0, 0.06)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
