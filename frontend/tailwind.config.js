/** @type {import('tailwindcss').Config} */
module.exports = {
  // Added src/ to the components path!
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: '#ff3838ff',
        maroon: '#DE1A58',
        very_dark_blue: '#00215E',
        dark_blue: '#134E8E',
        light_blue: '#1E93AB',
        yellow: '#F7CB46',
        orange: '#FF4400',
        teal: '#6FEDD6',
        green: '#219C90',
        black: '#111A09',
        background: '#F5EFE2',
        background_green: '#A8FF57',
        background_red: '#bc2d39ff',
        background_blue: '#3B4BD7',

      },
      fontFamily: {
        jb_mono: ['JetBrainsMono_400Regular'],
        jb_mono_medium: ['JetBrainsMono_500Medium'],
        jb_mono_bold: ['JetBrainsMono_700Bold'],
        jb_mono_extrabold: ['JetBrainsMono_800ExtraBold'],
        alfa: ['AlfaSlabOne_400Regular'],

      },
    }
  },
  plugins: [],
}