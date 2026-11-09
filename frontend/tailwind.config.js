/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#050511',
          600: '#050511',
          700: '#050511',
          900: '#050511',
        }
      }
    },
  },
  plugins: [],
}
