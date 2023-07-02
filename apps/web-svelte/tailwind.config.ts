import type { Config } from "tailwindcss";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
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
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        "catpuccin-latte": {
          "primary": "#7287fd", // lavender
          "secondary": "#1e66f5", // blue
          "accent": "#8839ef", // mauve
          "neutral": "#ccd0da", // surface0
          "neutral-content": "#5c5f77", // subtext1
          "base-100": "#eff1f5", // base
          "base-content": "#4c4f69", // text
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
          "neutral": "#313244", // surface0
          "neutral-content": "#bac2de", // subtext1
          "base-100": "#1e1e2e", // base
          "base-content": "#cdd6f4", // text
          "info": "#74c7ec", // sapphire
          "success": "#a6e3a1", // green
          "warning": "#fab387", // peach
          "error": "#f38ba8", // red
        },
      },
    ],
    darkTheme: "catpuccin-mocha",
    logs: true,
  },
} satisfies Config;
