import { eq } from "drizzle-orm";
import path from "node:path";
import { type Readable } from "node:stream";
import { type ReadableStream } from "node:stream/web";
import { db, dImage } from "server-db";
import env from "server-env";
import { z } from "zod";

export const defineDownloadEventHandler = (getData: (filepath: string) => Promise<Readable | ReadableStream>, fileType?: "avif" | "webp") => (
  defineEventHandler(async (event) => {
    const { id } = z.object({ id: z.coerce.number().int() }).parse(event.context.params);

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const filepath = path.resolve(env.IMG_FOLDER, filename);

    const respFilename = fileType ? filename.replace(/[^./\\]+$/, fileType) : filename;

    event.node.res.setHeader(
      "Content-Disposition",
      `attachment; filename=${respFilename}`,
    );

    return sendStream(event, await getData(filepath));
  })
);
