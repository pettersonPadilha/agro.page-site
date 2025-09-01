import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      fontFamily: {
        studioK: ["Studio K", "sans-serif"],
      },
      colors: {
        // primary: "rgb(221, 255, 102)",
        // orange: "rgb(255, 153, 96)",
        // green: "rgb(0, 255, 178)",
        // blueLight: "rgb(160 215 255)",
        // rose: "rgb(255 168 189)",
        // opaque: "#F5F5F5",
        // roxo: "rgb(160 145 255)",
        // yellowLight: "rgb(255 199 0)",
        // input: "rgba(250, 250, 250, 0.094)",
        // placeholderColor: "#746F69",
        // backgroundBlack: "rgb(0, 0, 0)",
        // backgroundGray: "rgb(24, 24, 24)",
        // backgroundBlue: "rgb(9, 2, 35)",
        // backgroundCinza: "rgb(29, 35, 46)",
        // button: "rgba(250, 250, 250, 0.02)",
        // graySpinner: "#2e2e2e85",
        // linear:
        //   "linear-gradient(200deg, rgba(250, 250, 250, 0.1) -3.98%, rgba(113, 114, 111, 0) 203.38%);",

        /**
         * Theme application
         */

        theme: {
          orange: "rgb(255, 139, 19)",
          black: "rgb(0, 178, 100)",
          green_400: "rgb(0, 120, 86)",
          green_300: "rgb(0, 178, 100)",
          yellow: "rgb(255, 247, 197)",
        },

        /**
         * RizzUI
         */

        background: colors.white,

        // foreground: colors.gray[200],

        muted: colors.gray[200],

        // color primária
        primary: {
          lighter: colors.gray[200],
          DEFAULT: "rgb(0, 178, 100)",
          dark: "rgb(0, 178, 100,0.9)",
          foreground: colors.white,
        },

        // color secundaria
        secondary: {
          lighter: "rgb(255, 139, 19)",
          DEFAULT: "rgb(255, 139, 19)",
          dark: "rgb(255, 139, 19)",
          foreground: colors.white,
        },

        red: {
          lighter: colors.rose[200],
          DEFAULT: colors.rose[500],
          dark: colors.rose[700],
        },

        orange: {
          lighter: colors.amber[800],
          DEFAULT: colors.amber[500],
          dark: colors.amber[700],
        },

        blue: {
          lighter: colors.sky[200],
          DEFAULT: colors.sky[500],
          dark: colors.sky[700],
        },

        green: {
          lighter: colors.emerald[200],
          DEFAULT: colors.emerald[500],
          dark: colors.emerald[700],
        },
      },
    },
  },
  // plugins: [require("@tailwindcss/forms")],
};
export default config;
