import type { RequestHandler } from "@sveltejs/kit";

import path from "node:path";
import { eq } from "drizzle-orm";
import { db, dImage } from "server-db";
import env from "server-env";
import * as v from "valibot";

const fileExtensionRegex = /[^./\\]+$/;

export const defineDownloadRequestHandler = (getData: (filepath: string) => BodyInit | PromiseLike<BodyInit>, fileType?: "avif" | "webp") => (
    (async ({ params }): Promise<Response> => {
      const { id } = v.parse(
        v.object({
          id: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(0)),
        }),
        params,
      );

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
            fileExtensionRegex,
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
