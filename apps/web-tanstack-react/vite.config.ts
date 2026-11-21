import { fileURLToPath } from "node:url";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { redact } from "@tanstack/redact/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const lucideReactEsm = fileURLToPath(
  import.meta.resolve("lucide-react/dist/esm/lucide-react.mjs"),
);

const config = defineConfig({
  ssr: {
    noExternal: true,
    external: [
      "server-db",
      "server-env",
      "server-graphql",
      "sharp",
    ],
  },
  plugins: [
    devtools(),
    tanstackStart(),
    nitro({
      plugins: ["server/plugins/database.ts"],
      rolldownConfig: {
        treeshake: {
          moduleSideEffects: true,
        },
      },
    }),
    viteReact({
      compiler: true,
    }),
    redact(),
  ],
  resolve: {
    alias: {
      "lucide-react": lucideReactEsm,
    },
    tsconfigPaths: true,
  },
  server: {
    host: "0.0.0.0",
  },
});

export default config;
