import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { defineDownloadRequestHandler } from "../downloadRequestHandler.js";

export const GET = defineDownloadRequestHandler(
  filepath => Readable.toWeb(createReadStream(filepath)) as ReadableStream,
);
