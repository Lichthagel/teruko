import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

import { defineDownloadEventHandler } from "~~/server/utils/downloadEventHandler";

export default defineDownloadEventHandler(
  filepath =>
    Readable.toWeb(createReadStream(filepath)),
);
