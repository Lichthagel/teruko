const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:svelte/recommended",
    "lichthagel",
    "lichthagel/node",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"],
    project: path.resolve(__dirname, "./tsconfig.json"),
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: [
          path.resolve(__dirname, "./tsconfig.json"),
          path.resolve(__dirname, "./.svelte-kit/tsconfig.json"),
        ],
      },
    },
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      extends: ["lichthagel/typescript"],
    },
    {
      files: ["**/*.ts?(x)"],
      extends: ["lichthagel/typescript"],
    },
  ],
  ignorePatterns: ["node_modules", ".svelte-kit", ".eslintrc.cjs"],
};
