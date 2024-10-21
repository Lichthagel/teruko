import { getPixivMetadata, matchFilename } from "#util/pixiv/index.js";
import { sql } from "drizzle-orm";
import { fileTypeFromBlob } from "file-type";
import { GraphQLError } from "graphql";
import { ImageExt, ImageMeta, mergeImageMeta } from "models";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import {
  // eslint-disable-next-line perfectionist/sort-named-imports
  dImage, dTag, d_ImageToTag, db,
} from "server-db";
import env from "server-env";
import sharp from "sharp";

import type { builder } from "../builder.js";

import { PothosImage } from "../Image.js";

const hasDimensions = (
  metadata: sharp.Metadata,
): metadata is { width: number; height: number } & sharp.Metadata =>
  metadata.width !== undefined && metadata.height !== undefined;

const inUpload: string[] = [];

const createImage = (b: typeof builder) => {
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
            ) { throw new GraphQLError("not an image"); }

            // check for existing image
            if (
              await db.query.Image.findFirst({
                where: (images, { eq }) => eq(images.filename, filename),
              })
            ) { throw new GraphQLError("image with that filename already exists"); }

            if (inUpload.includes(filename)) {
              throw new GraphQLError("image is already being uploaded");
            }

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

            if (!hasDimensions(metadata)) {
              throw new GraphQLError("cant read image dimensions");
            }

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
              const imageResults = await tx
                .insert(dImage)
                .values({
                  filename,
                  width: metadata.width,
                  height: metadata.height,
                  title: imageMeta.title,
                  source: imageMeta.source,
                })
                .returning();

              const imageResult = imageResults[0];

              if (!imageResult) {
                throw new Error("Image not created");
              }

              const image: ImageExt = {
                ...imageResult,
                tags: [],
              };

              if (imageMeta.tags && imageMeta.tags.length > 0) {
                await tx
                  .insert(dTag)
                  .values(imageMeta.tags)
                  .onConflictDoNothing();

                await tx.insert(d_ImageToTag).values(
                  imageMeta.tags.map((tag) => ({
                    imageId: image.id,
                    tagId: sql`(SELECT id FROM "Tag" WHERE "slug" = ${tag.slug})`,
                  })),
                );
              }

              return image;
            });

            inUpload.splice(inUpload.indexOf(filename), 1);

            return image;
          }),
        ),
    }));
};

export default createImage;
