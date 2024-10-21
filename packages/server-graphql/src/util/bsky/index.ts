import { ImageMeta } from "models";

import { GetPostThreadResponse } from "./types.js";

export const BSKY_POST_REGEX = /^(https?:\/\/)?(www\.)?bsky.app\/profile\/(?<handle>[^/]+)\/post\/(?<postId>[^/]+)$/;

export const fetchPost = async (handle: string, postId: string) => {
  const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${handle}/app.bsky.feed.post/${postId}&depth=0&parentHeight=0`);

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await response.json() as GetPostThreadResponse;

  if ("blocked" in data.thread) {
    throw new Error("Post is blocked");
  }

  if ("notFound" in data.thread) {
    throw new Error("Post not found");
  }

  return data.thread.post;
};

export const fetchData = async (handle: string, postId: string) => {
  const post = await fetchPost(handle, postId);

  const embed = post.embed;

  if (!embed) {
    throw new Error("Post does not contain embed");
  }

  if (!("images" in embed)) {
    throw new Error("Post embed does not contain images");
  }

  const imageMeta: ImageMeta = {
    title: ((post.record as Record<string, unknown>).text as string | undefined),
    source: `https://bsky.app/profile/${post.author.handle}/post/${post.author.displayName}`,
    tags: [
      {
        slug: "bsky",
        categorySlug: "source",
      },
      {
        slug: `artist_${post.author.handle}`,
        categorySlug: "artist",
      },
      ...(
        post.author.displayName ?
            [
              {
                slug: post.author.displayName,
                categorySlug: "artist",
              },
            ] :
            []
      ),
    ],
  };

  return {
    meta: imageMeta,
    imageUrls: embed.images.map((image) => image.fullsize),
  };
};
