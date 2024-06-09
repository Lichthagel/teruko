// @ts-check

import lichthagel from "@lichthagel/eslint-config";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...(await lichthagel({
    node: true,
  })),
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
];
