/** @type {import('tailwindcss').Config} */
module.exports = {
  // Added src/ to the components path!
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: '#C00707',
        maroon: '#DE1A58',
        very_dark_blue: '#00215E',
        dark_blue: '#134E8E',
        light_blue: '#1E93AB',
        yellow: '#FFB33F',
        orange: '#FF4400',
        teal: '#6FEDD6',
        green: '#219C90',
        black: '#151515',
        background: '#F5EFE2',
      },
      fontFamily: {
        rubik: ['Rubik_400Regular'],
        rubik_medium: ['Rubik_500Medium'],
        rubik_bold: ['Rubik_700Bold'],
      }
    }
  },
  plugins: [],
}