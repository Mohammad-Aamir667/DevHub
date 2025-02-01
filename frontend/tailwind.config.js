/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

    theme: {
      extend: {
        colors: {
          'dark-charcoal-gray': '#333333',
          'soft-white': '#F8F8F8',
          'light-gray': '#E5E5E5',
          'neon-pink': '#FF007F',
          'neon-pink-light': '#FF4D96',
           vibrantClay: '#00E0FF',
        },
      },
    },
  plugins: [ require('daisyui'),],
  daisyui: {
    themes: ["dark"], 
  },
}