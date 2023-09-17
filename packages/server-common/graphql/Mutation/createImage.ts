import { PothosImage } from "../Image";
import { builder } from "../builder";
import { fileTypeFromBlob } from "file-type";
import { dImage, dTag, d_ImageToTag, db } from "../../db";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import env from "../../env";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { createId } from "@paralleldrive/cuid2";
import { ImageExt, ImageMeta, mergeImageMeta } from "models";
import { getPixivMetadata, matchFilename } from "../../util/pixiv";

const inUpload: string[] = [];

export default (b: typeof builder) => {
  b.mutationField("createImage", (t) =>
    t.field({
      type: [PothosImage],
      args: {
        files: t.arg({
          type: ["Upload"],
          required: true,
        }),
      },
      resolve: async (parent, { files }) =>
        Promise.all(
          files.map(async (file) => {
            // destructure file

            const filename = file.name;

            const stream = Readable.from(file.stream());

            const fileType = await fileTypeFromBlob(file);

            if (
              !fileType ||
              !/^image\/(jpeg|gif|png|webp|avif)$/.test(fileType.mime)
            )
              throw new Error("not an image");

            // check for existing image
            if (
              await db.query.Image.findFirst({
                where: (images, { eq }) => eq(images.filename, filename),
              })
            )
              throw new Error("image with that filename already exists");

            if (inUpload.includes(filename))
              throw new Error("image is already being uploaded");

            // upload image
            inUpload.push(filename);

            const transform = sharp().avif({ quality: 90 });

            const out = fs.createWriteStream(
              path.resolve(env.IMG_FOLDER, filename),
            );

            stream.pipe(transform).pipe(out);

            await finished(out);
            out.close();

            const metadata = await transform.metadata();

            if (!metadata.width || !metadata.height)
              throw new Error("cant read image dimensions");

            let imageMeta: ImageMeta = {};

            // pixiv stuff

            const pixivId = matchFilename(filename);

            if (pixivId) {
              const pixivMeta = await getPixivMetadata(pixivId);

              if (pixivMeta) {
                imageMeta = mergeImageMeta(imageMeta, pixivMeta);
              }
            }

            // insert image into db

            const image = await db.transaction(async (tx) => {
              const res = await tx
                .insert(dImage)
                .values({
                  id: createId(), // TODO false positive?
                  filename,
                  width: metadata.width,
                  height: metadata.height,
                  title: imageMeta.title,
                  source: imageMeta.source,
                })
                .returning();

              const image: ImageExt = {
                ...res[0],
                tags: [],
              };

              if (imageMeta.tags && imageMeta.tags.length > 0) {
                await tx
                  .insert(dTag)
                  .values(imageMeta.tags)
                  .onConflictDoNothing();

                await tx.insert(d_ImageToTag).values(
                  imageMeta.tags.map((tag) => ({
                    A: image.id.toString(),
                    B: tag.slug,
                  })),
                );
              }

              return image;
            });

            inUpload.splice(inUpload.indexOf(filename), 1);

            return image;
          }),
        ),
    }),
  );
};
