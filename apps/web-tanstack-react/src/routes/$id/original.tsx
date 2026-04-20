import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { createFileRoute } from "@tanstack/react-router";
import { defineDownloadRequestHandler } from "#/downloadRequestHandler";

export const Route = createFileRoute("/$id/original")({
  server: {
    handlers: {
      GET: defineDownloadRequestHandler(
        filepath =>
          Readable.toWeb(createReadStream(filepath)) as ReadableStream,
      ),
    },
  },
});
