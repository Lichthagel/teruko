import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import sharp from "sharp";

import { defineDownloadEventHandler } from "~~/server/utils/downloadEventHandler";

export default defineDownloadEventHandler(
  (filepath) => {
    const pipeline = sharp().webp({ quality: 100 });
    const filestream = createReadStream(filepath);
    return Readable.toWeb(filestream.pipe(pipeline));
  },
  "webp",
);
