/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-undef */
/** @type {import("prettier").Config} */
const config = {
  // @ts-expect-error This is a valid Prettier config
  ...require("eslint-config-lichthagel/prettier.config.cjs"),
};

module.exports = config;
