/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enable class based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa1a1',
          400: '#ff6b6b',
          500: '#ff4d4d', // warm rose red
          600: '#e62e2e',
          700: '#b31c1c',
          800: '#901a1a',
          900: '#781b1b',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          850: '#640d22',
        },
        darkbg: {
          900: '#0d0d12',
          800: '#14141d',
          700: '#1c1c28',
          600: '#2b2b3d'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
