import type { RequestHandler } from "@sveltejs/kit";

import path from "node:path";
import { eq } from "drizzle-orm";
import { db, dImage } from "server-db";
import env from "server-env";
import { z } from "zod";

export const defineDownloadRequestHandler = (getData: (filepath: string) => Promise<BodyInit>, fileType?: "avif" | "webp") => (
    (async ({ params }): Promise<Response> => {
      const { id } = z.object({ id: z.coerce.number().int() }).parse(params);

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

      const data = await getData(filepath);

      const responseFilename = fileType
        ? filename.replace(
            /[^./\\]+$/,
            fileType,
          )
        : filename;

      return new Response(data, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename=${responseFilename}`,
        },
      });
    }) satisfies RequestHandler<{
      id: string;
    }>);
