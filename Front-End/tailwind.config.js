/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#6BC76A',
          2: '#B1F3CD',
          4: '#3B8CCB',
          5: '#004AAD',
          6: '#224A43',
          50: '#B1F3CD',
          100: '#7AE072',
          150: '#224A43',
          200: '#224A43',
          300: '#004AAD',
          350: '#6BC76A',
          400: '#3B8CCB',
          600: '#6BC76A',
        },
        secondary: {
          50: '#F3E8FF',
          100: '#D6BCFA',
          200: '#A855F7',
          300: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        shake: 'shake 0.3s ease-in-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};
