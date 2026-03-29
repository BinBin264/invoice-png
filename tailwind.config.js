/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Be Vietnam Pro',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        invoice: {
          teal: '#0d9488',
          tealDark: '#0f766e',
          paper: '#fafaf9',
        },
      },
    },
  },
  plugins: [],
};
