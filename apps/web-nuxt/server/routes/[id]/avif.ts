import path from "node:path";
import { z } from "zod";
import { env } from "server-common";
import { db, dImage, drizzle } from "server-common/db";
import sharp from "sharp";

export default defineEventHandler(async (event) => {
  const { id } = z.object({ id: z.string() }).parse(event.context.params);

  const image = await db
    .select()
    .from(dImage)
    .where(drizzle.eq(dImage.id, id))
    .limit(1);

  const [{ filename }] = image;

  if (!filename) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
    });
  }

  const filepath = path.resolve(env.IMG_FOLDER, filename);

  event.node.res.setHeader(
    "Content-Disposition",
    `attachment; filename=${filename.replace(/[^./\\]+$/, "avif")}`,
  );

  return sendStream(event, sharp(filepath).avif({ quality: 90 }));
});
