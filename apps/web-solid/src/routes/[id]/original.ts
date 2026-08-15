import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { defineDownloadRequestHandler } from "~/utils/downloadRequestHandler";

export const GET = defineDownloadRequestHandler(
  filepath => Readable.toWeb(createReadStream(filepath)) as ReadableStream,
);
