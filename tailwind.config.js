/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFCC00",
        burgerBg: "#8D5C00",
        background: {
          200: '#E3E3E3',
          300: '#D9D9D9',
          400: '#BCBCBC',
          600: '#9E9E9E',
          700: '#7E7E7E',
          900: '#3A3A3A',
        },
        scarlet: {
          200: '#FF5D5D',
          300: "#FF4A4A",
          400: "#C5001A",
          500: "#B70018",
        },
        secondaryGreen: '#64AF00',
      }
    },
  },
  plugins: [],
}

