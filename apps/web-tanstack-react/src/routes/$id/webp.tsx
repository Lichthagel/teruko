import { defineDownloadRequestHandler } from "#/downloadRequestHandler";
import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";

export const Route = createFileRoute("/$id/webp")({
  server: {
    handlers: {
      GET: defineDownloadRequestHandler(
        async filepath => new Uint8Array((await sharp(filepath).webp({ quality: 100 }).toBuffer())),
        "webp",
      ),
    },
  },
});
