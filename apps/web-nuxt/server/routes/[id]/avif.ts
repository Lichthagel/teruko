import { Readable } from "node:stream";
import sharp from "sharp";

import { defineDownloadEventHandler } from "~/server/utils/downloadEventHandler";

export default defineDownloadEventHandler(
  (filepath) =>
    sharp(filepath).avif({ quality: 90 })
      .toBuffer()
      .then((buffer) => Readable.from(buffer)),
  "avif",
);
