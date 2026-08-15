import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import sharp from "sharp";
import { defineDownloadRequestHandler } from "~/utils/downloadRequestHandler";

export const GET = defineDownloadRequestHandler(
  (filepath) => {
    const pipeline = sharp().avif({ quality: 90 });
    const filestream = createReadStream(filepath);
    return Readable.toWeb(filestream.pipe(pipeline)) as ReadableStream;
  },
  "avif",
);
