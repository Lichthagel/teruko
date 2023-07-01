const path = require("path");

/** @type {import("eslint").Linter.Config} */
// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "next/core-web-vitals",
    "lichthagel",
    "lichthagel/node",
    "lichthagel/react",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      extends: ["lichthagel/typescript"],
    },
  ],
  ignorePatterns: [
    "node_modules",
    ".next",
    "out",
    ".eslintrc.cjs",
    "prettier.config.cjs",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
};
