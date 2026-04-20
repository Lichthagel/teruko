import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";
import { defineDownloadRequestHandler } from "#/downloadRequestHandler";

export const Route = createFileRoute("/$id/avif")({
  server: {
    handlers: {
      GET: defineDownloadRequestHandler(
        (filepath) => {
          const pipeline = sharp().avif({ quality: 90 });
          const filestream = createReadStream(filepath);
          return Readable.toWeb(filestream.pipe(pipeline)) as ReadableStream;
        },
        "avif",
      ),
    },
  },
});
