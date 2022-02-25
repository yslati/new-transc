module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        BGF: "#654ea3",
        BGT: "#eaafc8",
        LBLUE: "#FFFDD0",
        VsColor: "#005DAB",
        GameFontColor: "#354964",
      },
      spacing: {
        100: "26rem",
        110: "30rem",
        120: "35rem",
        130: "40rem",
        140: "45rem",
        200: "60rem",
      },
      screens: {
        "3xl": "1620px",
        lmd: "840px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
