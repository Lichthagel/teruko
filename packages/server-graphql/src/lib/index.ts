import { sql } from "drizzle-orm";
import { fileTypeFromBlob } from "file-type";
import { GraphQLError } from "graphql";
import { ImageExt, ImageMeta } from "models";
import fs from "node:fs";
import path from "node:path";
import { finished } from "node:stream/promises";
import {
  d_ImageToTag, db, dImage, dTag,
} from "server-db";
import env from "server-env";
import sharp from "sharp";

const inUpload: string[] = [];

const hasDimensions = (
  metadata: sharp.Metadata,
): metadata is { width: number; height: number } & sharp.Metadata =>
  metadata.width !== undefined && metadata.height !== undefined;

const saveBlob = async (blob: Blob, filename: string) => {
  const fileType = await fileTypeFromBlob(blob);

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

  const transform = sharp(await blob.arrayBuffer()).avif({ quality: 90 });

  const out = fs.createWriteStream(
    path.resolve(env.IMG_FOLDER, filename),
  );

  transform.pipe(out);

  await finished(out);
  out.close();

  const metadata = await transform.metadata();

  if (!hasDimensions(metadata)) {
    throw new GraphQLError("cant read image dimensions");
  }

  return {
    metadata,
  };
};

const insertIntoDB = async (imageMeta: ImageMeta, fileMeta: { width: number; height: number } & sharp.Metadata, filename: string) => {
  const image = await db.transaction(async (tx) => {
    const imageResults = await tx
      .insert(dImage)
      .values(
        {
          filename,
          width: fileMeta.width,
          height: fileMeta.height,
          title: imageMeta.title,
          source: imageMeta.source,
        },
      )
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
};

export const processBlob = async (blob: Blob, filename: string, meta: ImageMeta) => {
  const { metadata } = await saveBlob(blob, filename);

  try {
    return await insertIntoDB(meta, metadata, filename);
  } catch (error) {
    fs.rmSync(path.resolve(env.IMG_FOLDER, filename));
    throw error;
  }
};

export const processFile = async (file: File, meta: ImageMeta) => processBlob(file, file.name, meta);

export const processUrl = async (url: string, meta: ImageMeta) => {
  const res = await fetch(url);

  const basename = url.split("/").pop();
  if (!basename) {
    throw new GraphQLError("failed to parse filename");
  }

  // check if basename contains file extension otherwise use content-type
  const filename = basename.includes(".") ? basename : `${basename}.${res.headers.get("content-type")?.split("/")[1]}`; // TODO improve

  return processBlob(await res.blob(), filename, meta);
};
