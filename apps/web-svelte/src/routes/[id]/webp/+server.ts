import sharp from "sharp";

import { defineDownloadRequestHandler } from "../downloadRequestHandler.js";

export const GET = defineDownloadRequestHandler(
  async filepath => new Uint8Array((await sharp(filepath).webp({ quality: 100 }).toBuffer())),
  "webp",
);
