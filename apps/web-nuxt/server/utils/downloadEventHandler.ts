import type { Readable } from "node:stream";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db, dImage } from "server-db";
import { ENV } from "varlock/env";
import { z } from "zod";

const fileExtensionRegex = /[^./\\]+$/;

export const defineDownloadEventHandler = (getData: (filepath: string) => Promise<Readable | globalThis.ReadableStream>, fileType?: "avif" | "webp") => (
  defineEventHandler(async (event) => {
    const { id } = z.object({ id: z.coerce.number().int() }).parse(event.context.params);

    const result = await db
      .select()
      .from(dImage)
      .where(eq(dImage.id, id))
      .limit(1);

    const image = result[0];

    if (!image) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }

    const { filename } = image;

    if (!filename) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }

    const filepath = path.resolve(ENV.IMG_FOLDER as string, filename);

    const respFilename = fileType ? filename.replace(fileExtensionRegex, fileType) : filename;

    event.node.res.setHeader(
      "Content-Disposition",
      `attachment; filename=${respFilename}`,
    );

    return sendStream(event, await getData(filepath));
  })
);
