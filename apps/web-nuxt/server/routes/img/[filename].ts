import fs from "node:fs";
import path from "node:path";
import env from "server-env";
import * as v from "valibot";

export default defineEventHandler(async (event) => {
  const { filename } = v.parse(
    v
      .object({ filename: v.string() }),
    event.context.params,
  );

  const filepath = path.resolve(env.IMG_FOLDER as string, filename);

  return fs.createReadStream(filepath);
});
