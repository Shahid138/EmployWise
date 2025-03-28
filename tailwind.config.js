/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryWhite: {
          100: '#F8FAFC',
          200: '#D9EAFD',
          300: '#BCCCDC',
          400: '#9AA6B2',
        },
        primaryDark: {
          100: '#404258',
          200: '#474E68',
          300: '#50577A',
          400: '#6B728E',
        }
      }
    },
  },
  plugins: [],
}

