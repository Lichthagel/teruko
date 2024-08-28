import type { Config } from "tailwindcss";

import preset from "tailwind-custom";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  presets: [preset],
} satisfies Config;
