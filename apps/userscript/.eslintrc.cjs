const path = require("path");

/** @type {import("eslint").Linter.Config} */
// eslint-disable-next-line no-undef
module.exports = {
  extends: ["lichthagel/typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    ".eslintrc.cjs",
    "prettier.config.cjs",
  ],
};
