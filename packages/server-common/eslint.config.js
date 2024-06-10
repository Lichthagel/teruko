// @ts-check

import lichthagel from "@lichthagel/eslint-config";
// eslint-disable-next-line n/no-extraneous-import
import ts from "typescript-eslint";

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
    rules: {
      "n/no-unsupported-features/node-builtins": ["error", { ignores: ["fetch"] }],
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
