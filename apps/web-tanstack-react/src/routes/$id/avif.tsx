import { defineDownloadRequestHandler } from "#/downloadRequestHandler";
import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";

export const Route = createFileRoute("/$id/avif")({
  server: {
    handlers: {
      GET: defineDownloadRequestHandler(
        async filepath => new Uint8Array(await sharp(filepath).avif({ quality: 90 }).toBuffer()),
        "avif",
      ),
    },
  },
});
