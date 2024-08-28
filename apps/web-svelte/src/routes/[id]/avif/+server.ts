import type { RequestHandler } from "@sveltejs/kit";

import { eq } from "drizzle-orm";
import path from "node:path";
import { dImage, db } from "server-db";
import env from "server-env";
import sharp from "sharp";
import { z } from "zod";

export const GET = (async ({ params }): Promise<Response> => {
  const { id } = z.object({ id: z.string() }).parse(params);

  const image = await db
    .select()
    .from(dImage)
    .where(eq(dImage.id, id))
    .limit(1);

  if (!image[0]) {
    return new Response(null, { status: 404 });
  }

  const [{ filename }] = image;

  const filepath = path.resolve(env.IMG_FOLDER, filename);

  const data = await sharp(filepath).avif({ quality: 90 })
    .toBuffer();

  const response = new Response(data.buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${filename.replace(
        /[^./\\]+$/,
        "avif",
      )}`,
    },
  });

  return response;
}) satisfies RequestHandler<{
  filename: string;
}>;
