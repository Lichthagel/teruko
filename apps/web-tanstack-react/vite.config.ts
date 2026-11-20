import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { redact } from "@tanstack/redact/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  ssr: {
    noExternal: true,
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
    tsconfigPaths: true,
  },
  server: {
    host: "0.0.0.0",
  },
});

export default config;
