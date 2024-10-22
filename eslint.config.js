import react from "@eslint-react/eslint-plugin";
import lichthagel from "@lichthagel/eslint-config";
import vue from "eslint-plugin-vue";
import path from "node:path";
import next from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...await lichthagel({
    browser: true,
    node: true,
    svelte: true,
  }),
  ...vue.configs["flat/recommended"],
  react.configs.recommended,
  {
    name: "@next/eslint-plugin-next/recommended",
    plugins: {
      "@next/next": next,
    },
    rules: {
      ...(Object.fromEntries(
        Object.entries(next.configs.recommended.rules).map(([key]) => [key, "error"])
      )),
    },
    settings: {
      next: {
        rootDir: path.join(import.meta.dirname, "./apps/web-next"),
      },
    }
  },
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".svelte", ".vue"],
        projectService: {
          allowDefaultProject: ["*.config.js", "*.config.cjs"],
          defaultProject: path.join(import.meta.dirname, "tsconfig.eslint.json"),
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
    files: ["packages/**/*.config.{cjs,js,mjs,ts}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        projectService: false,
      }
    }
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
      "eslint.config.js"
    ],
  },
];
