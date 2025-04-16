import { BSKY_POST_REGEX, fetchData } from "services/bsky";

import { processUrl } from "#lib/index.js";

import type { builder } from "../builder.js";

import { PothosImage } from "../Image.js";

const createImageFromUrlBsky = (b: typeof builder) => {
  b.mutationField("createImageFromUrlBsky", (t) =>
    t.field({
      type: [PothosImage],
      args: {
        url: t.arg.string({
          required: true,
        }),
      },
      resolve: async (parent, { url }) => {
        const match = BSKY_POST_REGEX.exec(url);

        if (!match || !match.groups) {
          throw new Error("Invalid URL");
        }

        const { handle, postId } = match.groups;

        if (!handle || !postId) {
          throw new Error("Invalid URL");
        }

        const data = await fetchData(handle, postId);

        return await Promise.all(
          data.imageUrls.map(async (imageUrl) => processUrl(imageUrl, data.meta)),
        );
      },
    }));
};

export default createImageFromUrlBsky;
