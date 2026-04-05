import fs from "node:fs/promises";
import { defineDownloadRequestHandler } from "~/utils/downloadRequestHandler";

export const GET = defineDownloadRequestHandler(
  async filepath => new Uint8Array(await fs.readFile(filepath)),
);
