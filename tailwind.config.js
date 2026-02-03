/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // HungerWood Brand Colors
        primary: {
          DEFAULT: '#6B3F2A', // Wood brown
          50: '#F5F0ED',
          100: '#E8DDD6',
          200: '#D1BAAD',
          300: '#BA9784',
          400: '#A3745B',
          500: '#6B3F2A', // Main brand color
          600: '#4A2A1C', // Dark variant
          700: '#3E2318',
          800: '#321C13',
          900: '#26150F',
          dark: '#4A2A1C',
        },

        // Background Colors
        background: {
          DEFAULT: '#FFF8F1', // Cream
          light: '#FFFCF9',
          dark: '#FFF3E8',
        },

        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
          muted: '#F5F5F5',
        },

        // Text Colors
        text: {
          primary: '#2E1B12',
          secondary: '#6B6B6B',
          tertiary: '#999999',
          inverse: '#FFFFFF',
        },

        // Border Colors
        border: {
          DEFAULT: '#E6D5C3',
          light: '#F0E5D8',
          dark: '#D4C0AC',
        },

        // Status Colors
        success: {
          DEFAULT: '#2E7D32', // Veg
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#2E7D32',
          600: '#1B5E20',
          700: '#145520',
        },

        danger: {
          DEFAULT: '#C62828', // Non-veg
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#C62828',
          600: '#B71C1C',
          700: '#A01818',
        },

        warning: {
          DEFAULT: '#F9A825',
          50: '#FFF9E6',
          100: '#FFECB3',
          500: '#F9A825',
          600: '#F57F17',
          700: '#E65100',
        },

        // CTA (Call to Action)
        cta: {
          DEFAULT: '#3E2723',
          hover: '#2B1B17',
          active: '#1E1210',
        },
      },

      fontFamily: {
        sans: ['Google Sans', 'system-ui', '-apple-system', 'sans-serif'],
        poppins: ['Google Sans', 'sans-serif'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },

      spacing: {
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.625rem',   // 10px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.25rem',   // 20px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgba(107, 63, 42, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(107, 63, 42, 0.1), 0 1px 2px 0 rgba(107, 63, 42, 0.06)',
        'md': '0 4px 6px -1px rgba(107, 63, 42, 0.1), 0 2px 4px -1px rgba(107, 63, 42, 0.06)',
        'lg': '0 10px 15px -3px rgba(107, 63, 42, 0.1), 0 4px 6px -2px rgba(107, 63, 42, 0.05)',
        'xl': '0 20px 25px -5px rgba(107, 63, 42, 0.1), 0 10px 10px -5px rgba(107, 63, 42, 0.04)',
        '2xl': '0 25px 50px -12px rgba(107, 63, 42, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(107, 63, 42, 0.06)',
        'card': '0 2px 8px rgba(107, 63, 42, 0.08)',
        'elevated': '0 4px 12px rgba(107, 63, 42, 0.12)',
        'none': 'none',
      },

      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in',
        'slideUp': 'slideUp 0.3s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
        'slideLeft': 'slideLeft 0.3s ease-out',
        'slideRight': 'slideRight 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
