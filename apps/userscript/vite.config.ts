import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import solid from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    solid(),
    monkey({
      entry: "src/main.ts",
      build: {
        fileName: "teruko.user.js",
      },
      userscript: {
        name: "Teruko Userscript",
        namespace: "Lichthagel",
        author: "Lichthagel",
        homepageURL: "https://github.com/Lichthagel/teruko",
        supportURL: "https://github.com/Lichthagel/teruko/issues",
        match: ["*://www.pixiv.net/*"],
      },
    }),
  ],
  server: {
    port: 5174,
  },
});
