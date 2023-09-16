import { PothosImage } from "../Image";
import { builder } from "../builder";
import { fileTypeFromBlob } from "file-type";
import { dImage, db } from "../../db";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import env from "../../env";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { createId } from "@paralleldrive/cuid2";

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

            // TODO pixiv stuff

            // insert image into db

            const image = await db
              .insert(dImage)
              .values({
                id: createId(),
                filename,
                width: metadata.width,
                height: metadata.height,
              })
              .returning();

            inUpload.splice(inUpload.indexOf(filename), 1);

            return image[0];
          }),
        ),
    }),
  );
};
