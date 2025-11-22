/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-300": "#808CFD",
        "primary-100": "#E9ECFF",
        "hover-100": "#D6D9EA",
        "hover-white": "#F4F4F4",
        white: "#FFFFFF",
        black: "#000000",
        error: "#FF0000",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      fontSize: {
        "heading-h1": ["125px", { fontWeight: "900" }],
        "heading-h2": ["100px", { fontWeight: "800" }],
        "nickname": ["60px", { fontWeight: "800" }],
        "heading-h3": ["40px", { fontWeight: "700" }],
        "heading-h4": ["30px", { fontWeight: "600" }],
        "body-big": ["40px", { fontWeight: "400" }],
        "body-base": ["22px", { fontWeight: "400" }],
        "body-small": ["15px", { fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
