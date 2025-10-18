import fs from "node:fs";

import { defineDownloadEventHandler } from "~~/server/utils/downloadEventHandler";

export default defineDownloadEventHandler(
  async filepath =>
    Promise.resolve(fs.createReadStream(filepath)),
);
