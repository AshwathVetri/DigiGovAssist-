/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f5fa',
          100: '#e1ecf6',
          200: '#c2d8ec',
          300: '#93bbde',
          400: '#5d99cc',
          500: '#2b73b3',
          600: '#165a99',
          700: '#0f4477',
          800: '#0d3862',
          900: '#0a2746',
          950: '#06172a',
        },
        deepblue: {
          900: '#0a2240',
          950: '#07182d',
        },
        india: {
          saffron: '#FF671F',
          saffronDark: '#d9531e',
          navy: '#0b2545',
          green: '#046A38',
          greenDark: '#034d28',
        },
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans"',
          '"Noto Sans Devanagari"',
          '"Noto Sans Tamil"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
