import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Data files (e.g. TYPE_COLORS in lib/data) also carry Tailwind classes.
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "hsl(41, 44%, 97%)",
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
        burgundy: {
          50: "#fdf2f4",
          100: "#fae0e6",
          200: "#f4bac9",
          300: "#e88ea2",
          400: "#d95e78",
          500: "#be3354",
          600: "#8b1c34",
          700: "#6d1429",
          800: "#550f20",
          900: "#3d0a18",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#c77c00",
          600: "#a86400",
          700: "#7c4a00",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "ui-serif", "Georgia", "serif"],
        accent: ["Cormorant Garamond", "Georgia", "serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
