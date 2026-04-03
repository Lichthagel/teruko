import antfu, { react, solid } from "@antfu/eslint-config";

export default antfu({
  vue: true,
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
    "**/.nitro/**",
    "**/.solid-start/**",
    "**/routeTree.gen.ts",
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
    ignoresTypeAware: ["**/*.config.js", "**/*.config.cjs", "**/*.config.ts"],
  },
}, solid({
  files: ["apps/web-solidstart/**", "apps/userscript/**"],
}), react({
  files: ["apps/web-tanstack-react/**"],
  overrides: {
    "react-refresh/only-export-components": "off",
  },
}));
