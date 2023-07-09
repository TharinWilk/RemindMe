/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./renderer/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  fontFace: [
    {
      "font-family": "belanosima",
      "font-style": "normal",
      "font-weight": "400",
      src: ['url(/assets/fonts/Belanosima-Regular.ttf) format("truetype")'],
    },
  ],
};
