import type { Config } from "tailwindcss";
import preset from "tailwind-custom";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [preset],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-readex-pro)", "var(--font-m-plus-1)", "sans-serif"],
      },
    },
  },
} satisfies Config;
