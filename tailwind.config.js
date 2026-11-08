/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0B2418',
          900: '#123D2A', // Primary deep forest green
          800: '#184D35',
          700: '#216144',
          600: '#2B7A56',
          100: '#E6F0EB',
          50: '#F2F7F4',
        },
        gold: {
          700: '#A98028',
          600: '#BF932F',
          500: '#D6A83E', // Primary rich golden yellow
          400: '#E4BD5F',
          300: '#F0D48A',
          100: '#FAF2DD',
          50: '#FDFBF5',
        },
        cream: {
          50: '#FCFBF7',
          100: '#F7F5EC', // Primary soft cream
          200: '#EFECE0',
          300: '#E3DFC8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        kannada: ['"Noto Sans Kannada"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 61, 42, 0.08)',
        'premium': '0 12px 35px -5px rgba(18, 61, 42, 0.12), 0 4px 10px -2px rgba(214, 168, 62, 0.05)',
        'elevated': '0 20px 40px -10px rgba(18, 61, 42, 0.18)',
      }
    },
  },
  plugins: [],
}
