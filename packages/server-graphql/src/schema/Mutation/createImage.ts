import { ImageMeta, mergeImageMeta } from "models";

import { processBlob } from "#lib/index.js";
import { getPixivMetadata, matchFilename } from "#util/pixiv/index.js";

import type { builder } from "../builder.js";

import { PothosImage } from "../Image.js";

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
            return processBlob(file, filename, imageMeta);
          }),
        ),
    }));
};

export default createImage;
