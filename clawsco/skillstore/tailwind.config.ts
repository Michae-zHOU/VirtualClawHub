/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amazonBlue: '#0f1111',
        amazonDarkBlue: '#232f3e',
        amazonOrange: '#f90',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}