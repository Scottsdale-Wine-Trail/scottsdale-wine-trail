import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f8d0d9",
          300: "#f2aabb",
          400: "#e87898",
          500: "#da4f73",
          600: "#c43060",
          700: "#a3204f",
          800: "#891d47",
          900: "#761d42",
          950: "#420a21",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
