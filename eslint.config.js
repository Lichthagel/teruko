import react from "@eslint-react/eslint-plugin";
import lichthagel from "@lichthagel/eslint-config";
import vue from "eslint-plugin-vue";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...await lichthagel({
    browser: true,
    node: true,
    react: false,
    svelte: true,
  }),
  ...vue.configs["flat/recommended"],
  react.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".svelte", ".vue"],
        projectService: {
          allowDefaultProject: ["*.config.js", "*.config.cjs"],
          defaultProject: "./tsconfig.eslint.json",
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      globals: {
        computed: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        defineProps: "readonly",
        onBeforeUnmount: "readonly",
        onMounted: "readonly",
        onUnmounted: "readonly",
        reactive: "readonly",
        ref: "readonly",
        shallowReactive: "readonly",
        shallowRef: "readonly",
        toRef: "readonly",
        toRefs: "readonly",
        useHead: "readonly",
        useRoute: "readonly",
        useRouter: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
      },
    },
    rules: {
      "vue/attributes-order": "off",
      "vue/multi-word-component-names": "off",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.nx/**",
      "**/.next/**",
      "**/.svelte-kit/**",
      "**/.output/**",
      "**/.nuxt/**",
      "**/build/**",
      "eslint.config.js",
    ],
  },
];
