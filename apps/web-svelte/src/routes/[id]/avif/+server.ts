import sharp from "sharp";

import { defineDownloadRequestHandler } from "../downloadRequestHandler.js";

export const GET = defineDownloadRequestHandler(
  async (filepath) =>
    sharp(filepath).avif({ quality: 90 })
      .toBuffer(),
  "avif",
);
