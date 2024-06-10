import path from "node:path";
import { z } from "zod";
import env from "server-env";
import { db, dImage } from "server-db";
import sharp from "sharp";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = z.object({ id: z.string() }).parse(event.context.params);

  const image = await db
    .select()
    .from(dImage)
    .where(eq(dImage.id, id))
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

  return sendStream(event, sharp(filepath).webp({ quality: 100 }));
});
