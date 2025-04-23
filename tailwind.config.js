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
          300: '#D9D9D9',
          400: '#BCBCBC',
        },
        scarlet: {
          300: "#FF4A4A",
          400: "#C5001A",
          500: "#B70018",
        }
      }
    },
  },
  plugins: [],
}

