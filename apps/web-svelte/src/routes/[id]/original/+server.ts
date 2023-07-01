import type { RequestHandler } from "@sveltejs/kit";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { dImage, db, drizzle } from "server-common/db";
import { env } from "server-common";

export const GET = (async ({ params }): Promise<Response> => {
  const { id } = z.object({ id: z.string() }).parse(params);

  const image = await db
    .select()
    .from(dImage)
    .where(drizzle.eq(dImage.id, id))
    .limit(1);

  const [{ filename }] = image;

  if (!filename) {
    return new Response(null, { status: 404 });
  }

  const filepath = path.resolve(env.IMG_FOLDER, filename);

  const file = await fs.readFile(filepath);

  const response = new Response(file, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  });

  return response;
}) satisfies RequestHandler<{
  filename: string;
}>;
