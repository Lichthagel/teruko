/** @type {import("prettier").Config} */
const config = {
  // @ts-ignore
  ...require("eslint-config-lichthagel/prettier.config.cjs"),
  plugins: [],
  pluginSearchDirs: ["."],
};

module.exports = config;
