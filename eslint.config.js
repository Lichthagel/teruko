import path from "node:path";
import antfu from "@antfu/eslint-config";

export default antfu({
  vue: true,
  solid: true,
  svelte: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/.nx/**",
    "**/.next/**",
    "**/.svelte-kit/**",
    "**/.output/**",
    "**/.nuxt/**",
    "**/build/**",
  ],
  rules: {
    "antfu/top-level-function": "off",
    "ts/no-redeclare": "off",
    "ts/no-use-before-define": "off",
    "func-style": ["error", "expression"],
    "ts/strict-boolean-expressions": "off",
    "ts/consistent-type-definitions": ["error", "type"],
    "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
  },
  typescript: {
    tsconfigPath: path.join(import.meta.dirname, "tsconfig.eslint.json"),
    ignoresTypeAware: ["**/*.config.js", "**/*.config.cjs", "**/*.config.ts"],
  },
});
