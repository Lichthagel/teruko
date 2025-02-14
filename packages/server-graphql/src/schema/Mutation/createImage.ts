import { type ImageMeta, mergeImageMeta } from "models";

import { processFile } from "#lib/index.js";
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
        title: t.arg.string(),
        source: t.arg.string(),
        tags: t.arg.stringList(),
      },
      resolve: async (parent, {
        files, title, source, tags,
      }) => {
        const imageMetaArgs = {
          title: title ?? undefined,
          source: source ?? undefined,
          tags: ((tags ?? []).map((slug) => ({ slug }))),
        };

        return Promise.all(
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

            imageMeta = mergeImageMeta(imageMeta, imageMetaArgs);

            // insert image into db
            return processFile(file, imageMeta);
          }),
        );
      },
    }));
};

export default createImage;
