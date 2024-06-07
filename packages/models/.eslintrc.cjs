const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["lichthagel/typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.json"),
  },
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: [path.resolve(__dirname, "./tsconfig.json")],
      },
    },
  },
  ignorePatterns: ["node_modules", ".eslintrc.cjs", "dist"],
};
