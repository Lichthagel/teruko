import fs from "node:fs";
import path from "node:path";
import { ENV } from "varlock/env";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { filename } = z
    .object({ filename: z.string() })
    .parse(event.context.params);

  const filepath = path.resolve(ENV.IMG_FOLDER as string, filename);

  return sendStream(event, fs.createReadStream(filepath));
});
