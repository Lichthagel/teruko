import { createReadStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { createFileRoute } from "@tanstack/react-router";
import env from "server-env";

export const Route = createFileRoute("/img/$filename")({
  server: {
    handlers: {
      GET: async (ctx) => {
        const filePath = path.join(env.IMG_FOLDER, ctx.params.filename);

        const filestream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;

        const response = new Response(filestream, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        return response;
      },
    },
  },
});
