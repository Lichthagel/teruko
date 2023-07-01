const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "lichthagel/base",
    "lichthagel/node",
    "@nuxt/eslint-config",
    "prettier",
  ],
  rules: {},
  settings: {
    "import/resolver": {
      typescript: {
        project: [
          path.join(__dirname, "tsconfig.json"),
          path.join(__dirname, "server/tsconfig.json"),
          path.join(__dirname, ".nuxt/tsconfig.json"),
          path.join(__dirname, ".nuxt/tsconfig.server.json"),
        ],
      },
    },
  },
  ignorePatterns: ["node_modules", ".nuxt", "dist", ".eslintrc.cjs"],
};
