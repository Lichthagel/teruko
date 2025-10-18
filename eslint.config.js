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
    "eslint.config.js"
  ]
});
