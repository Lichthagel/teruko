import sharp from "sharp";
import { defineDownloadRequestHandler } from "~/utils/downloadRequestHandler";

export const GET = defineDownloadRequestHandler(
  async filepath => new Uint8Array((await sharp(filepath).webp({ quality: 100 }).toBuffer())),
  "webp",
);
