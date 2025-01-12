import { Readable } from "node:stream";
import sharp from "sharp";

import { defineDownloadEventHandler } from "~/server/utils/downloadEventHandler";

export default defineDownloadEventHandler(
  (filepath) =>
    sharp(filepath).webp({ quality: 100 })
      .toBuffer()
      .then((buffer) => Readable.from(buffer)),
  "webp",
);
