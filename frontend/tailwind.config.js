/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080b14',
        panel: '#111827',
        neon: '#34d399',
      },
    },
  },
  plugins: [],
}
