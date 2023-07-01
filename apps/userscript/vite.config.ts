import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "Teruko Userscript",
        namespace: "Lichthagel",
        version,
        author: "Lichthagel",
        description: "",
        homepageURL: "https://github.com/Lichthagel/teruko",
        supportURL: "https://github.com/Lichthagel/teruko/issues",
        match: ["https://www.pixiv.net/*"],
      },
    }),
  ],
});
