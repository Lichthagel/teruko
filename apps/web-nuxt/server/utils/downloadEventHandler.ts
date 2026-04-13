import type { Readable } from "node:stream";
import path from "node:path";
import { eq } from "drizzle-orm";
import { HTTPError } from "h3";
import { db, dImage } from "server-db";
import env from "server-env";
import * as v from "valibot";

const fileExtensionRegex = /[^./\\]+$/;

export const defineDownloadEventHandler = (getData: (filepath: string) => Promise<Readable | globalThis.ReadableStream>, fileType?: "avif" | "webp") => (
  defineEventHandler(async (event) => {
    const { id } = v.parse(
      v.object({
        id: v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(0)),
      }),
      event.context.params,
    );

    const res = await db
      .select()
      .from(dImage)
      .where(eq(dImage.id, id))
      .limit(1);

    const image = res[0];

    if (!image || !image.filename) {
      throw new HTTPError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }

    const filepath = path.resolve(env.IMG_FOLDER as string, image.filename);

    const respFilename = fileType ? image.filename.replace(fileExtensionRegex, fileType) : image.filename;

    event.node.res.setHeader(
      "Content-Disposition",
      `attachment; filename=${respFilename}`,
    );

    return await getData(filepath);
  })
);
