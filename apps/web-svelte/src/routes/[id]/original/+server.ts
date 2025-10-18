import fs from "node:fs/promises";

import { defineDownloadRequestHandler } from "../downloadRequestHandler.js";

export const GET = defineDownloadRequestHandler(
  async filepath => new Uint8Array(await fs.readFile(filepath)),
);
