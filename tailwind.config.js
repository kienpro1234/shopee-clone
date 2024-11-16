const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        orange: "#ee4d2d",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme, addComponents }) {
      // addUtilities({
      //   ".container": {
      //     maxWidth: theme("columns.7xl"),
      //     marginLeft: "auto",
      //     marginRight: "auto",
      //     paddingLeft: theme("spacing.4"),
      //     paddingRight: theme("spacing.4"),
      //   },
      // });
      addComponents({
        ".container": {
          maxWidth: theme("columns.7xl"),
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: theme("spacing.4"),
          paddingRight: theme("spacing.4"),
        },
      });
    }),
  ],
};
