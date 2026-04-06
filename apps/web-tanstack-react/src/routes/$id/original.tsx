import fs from "node:fs/promises";
import { defineDownloadRequestHandler } from "#/downloadRequestHandler";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$id/original")({
  server: {
    handlers: {
      GET: defineDownloadRequestHandler(
        async filepath => new Uint8Array(await fs.readFile(filepath)),
      ),
    },
  },
});
