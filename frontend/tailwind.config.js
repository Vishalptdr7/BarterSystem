// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");
const daisy = require("daisyui");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisy],
  daisyui: {
    themes: ["light", "dart", "cupcake", "retro"], // Corrected 'daisy' to 'daisyui' and 'theme' to 'themes'
  },
});
