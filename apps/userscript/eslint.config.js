// @ts-check

import lichthagel from "@lichthagel/eslint-config";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...(await lichthagel({
    browser: true,
  })),
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
    rules: {
      "@stylistic/operator-linebreak": "off", // Currently handled by Prettier
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
];
