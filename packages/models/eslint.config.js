// @ts-check

import lichthagel from "@lichthagel/eslint-config";
import ts from "typescript-eslint";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...(await lichthagel({})),
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
  },
  {
    files: ["eslint.config.js"],
    // prettier-ignore
    ...(/** @type {import("eslint").Linter.FlatConfig} */ (
      ts.configs.disableTypeChecked
    )),
  },
  {
    ignores: ["node_modules", "dist"],
  },
];
