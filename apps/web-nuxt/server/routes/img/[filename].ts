import fs from "node:fs";
import path from "node:path";
import env from "server-env";
import { z } from "zod";

export default defineEventHandler((event) => {
  const { filename } = z
    .object({ filename: z.string() })
    .parse(event.context.params);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const filepath = path.resolve(env.IMG_FOLDER, filename);

  return sendStream(event, fs.createReadStream(filepath));
});
