import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        masonry: "masonry",
      },
      keyframes: {
        load: {
          "0%": {
            opacity: "0",
            transform: "scaleX(0)",
          },
          "50%": {
            opacity: "1",
            transform: "scaleX(0.2)",
          },
          "100%": {
            opacity: "0",
            transform: "scaleX(1)",
          },
        },
      },
      animation: {
        load: "load 1s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["'Readex Pro'", "'M Plus 1'", "sans-serif"],
      },
      screens: {
        "3xl": "2120px",
      },
    },
  },
  plugins: [daisyui, animate],
  daisyui: {
    themes: [
      {
        "catpuccin-latte": {
          "primary": "#7287fd", // lavender
          "secondary": "#1e66f5", // blue
          "accent": "#8839ef", // mauve
          "neutral": "#9ca0b0", // overlay 0
          "base-100": "#eff1f5", // base
          "info": "#209fb5", // sapphire
          "success": "#40a02b", // green
          "warning": "#fe640b", // peach
          "error": "#d20f39", // red
        },
      },
      {
        "catpuccin-mocha": {
          "primary": "#b4befe", // lavender
          "secondary": "#89b4fa", // blue
          "accent": "#cba6f7", // mauve
          "neutral": "#6c7086", // overlay 0
          "base-100": "#1e1e2e", // base
          "info": "#74c7ec", // sapphire
          "success": "#a6e3a1", // green
          "warning": "#fab387", // peach
          "error": "#f38ba8", // red
        },
      },
    ],
    darkTheme: "catpuccin-mocha",
  },
} satisfies Config;
