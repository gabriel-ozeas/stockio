const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
         fadeNewMessage: {
           '0%': { opacity: 0, transform: 'translateY(1rem)' },
           '100%': { opacity: 1, transform: 'translateY(0rem)' },
         }
      },
      animation: {
        fadeNewItem: 'fadeNewMessage 0.5s'
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      green: colors.emerald
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
