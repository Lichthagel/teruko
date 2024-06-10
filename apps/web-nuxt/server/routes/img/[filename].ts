import path from "node:path";
import { z } from "zod";
import fs from "node:fs";
import env from "server-env";

export default defineEventHandler((event) => {
  const { filename } = z
    .object({ filename: z.string() })
    .parse(event.context.params);

  const filepath = path.resolve(env.IMG_FOLDER, filename);

  return sendStream(event, fs.createReadStream(filepath));
});
