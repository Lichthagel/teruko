/* eslint-disable no-undef */

/** @type {import("prettier").Config} */
const config = {
  // @ts-ignore
  ...require("eslint-config-lichthagel/prettier.config.cjs"),
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};

module.exports = config;
