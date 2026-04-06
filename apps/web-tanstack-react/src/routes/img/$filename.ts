import fs from "node:fs/promises";
import path from "node:path";
import { createFileRoute } from "@tanstack/react-router";
import env from "server-env";

export const Route = createFileRoute("/img/$filename")({
  server: {
    handlers: {
      GET: async (ctx) => {
        const filePath = path.join(env.IMG_FOLDER, ctx.params.filename);

        const file = await fs.readFile(filePath);

        const response = new Response(file, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        return response;
      },
    },
  },
});
