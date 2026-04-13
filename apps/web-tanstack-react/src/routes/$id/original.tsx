import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { defineDownloadRequestHandler } from "#/downloadRequestHandler";
import { createFileRoute } from "@tanstack/react-router";

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
