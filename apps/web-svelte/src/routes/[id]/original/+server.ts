import type { RequestHandler } from "@sveltejs/kit";

import { eq } from "drizzle-orm";
import fs from "node:fs/promises";
import path from "node:path";
import { dImage, db } from "server-db";
import env from "server-env";
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
