import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import monkey from "vite-plugin-monkey";
import solid from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const terukoBaseUrl = loadEnv(mode, process.cwd(), "").VITE_TERUKO_BASE_URL;
  const connectHost = terukoBaseUrl ? new URL(terukoBaseUrl).hostname : "localhost";

  return {
    plugins: [
      solid(),
      monkey({
        entry: "src/main.ts",
        build: {
          fileName: "teruko.user.js",
        },
        userscript: {
          name: "Teruko Userscript",
          grant: ["GM_getValue", "GM_setValue", "GM_xmlhttpRequest"],
          namespace: "Lichthagel",
          author: "Lichthagel",
          homepageURL: "https://github.com/Lichthagel/teruko",
          supportURL: "https://github.com/Lichthagel/teruko/issues",
          match: ["*://www.pixiv.net/*"],
          connect: [connectHost, "www.pixiv.net"],
        },
      }),
    ],
    server: {
      port: 5174,
    },
  };
});
