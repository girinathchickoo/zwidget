/** @type {import('tailwindcss').Config} */
const COLOR_PALLETTE = require("./src/Constants/theme/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...COLOR_PALLETTE,
      },
    },
  },
  plugins: [],
};
