import sharp from "sharp";
import { defineDownloadRequestHandler } from "~/utils/downloadRequestHandler";

export const GET = defineDownloadRequestHandler(
  async filepath => new Uint8Array(await sharp(filepath).avif({ quality: 90 }).toBuffer()),
  "avif",
);
