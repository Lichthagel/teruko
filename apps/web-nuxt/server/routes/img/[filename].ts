import fs from "node:fs";
import path from "node:path";
import env from "server-env";
import { z } from "zod";

export default defineEventHandler((event) => {
  const { filename } = z
    .object({ filename: z.string() })
    .parse(event.context.params);

  const filepath = path.resolve(env.IMG_FOLDER, filename);

  return sendStream(event, fs.createReadStream(filepath));
});
