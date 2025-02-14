import { type ImageMeta } from "models";

import type PixivIllustResult from "./PixivIllustResult.js";

export const matchFilename = (filename: string) => {
  const matches = filename.match(/(\d+)_p\d+\.(?:jpg|png|gif|jpeg|webp|avif)/);
  if (matches) {
    return matches[1];
  }
  return null;
};

export const fetchPixiv = async (
  pixivId: string,
): Promise<PixivIllustResult> => {
  const res = await fetch(`https://www.pixiv.net/ajax/illust/${pixivId}`, {
    headers: {
      "Accept-Language": "en-US",
    },
  });

  return (await res.json()) as PixivIllustResult;
};

export const toImageMeta = (
  pixivResult: PixivIllustResult,
  pixivIdFallback?: string,
): ImageMeta => {
  const tags: Exclude<ImageMeta["tags"], null | undefined> = [
    {
      slug: "pixiv",
      categorySlug: "source",
    },
  ];

  if (!pixivResult.body) {
    return {
      source: pixivIdFallback
        ? `https://www.pixiv.net/en/artworks/${pixivIdFallback}`
        : undefined,
      tags,
    };
  }

  if (pixivResult.body.userId) {
    const userId = `artist_${pixivResult.body.userId}`;

    tags.push({
      slug: userId,
      categorySlug: "artist",
    });
  }

  if (pixivResult.body.userName && pixivResult.body.userName !== "") {
    tags.push({
      slug: pixivResult.body.userName,
      categorySlug: "artist",
    });
  }

  if (pixivResult.body.isOriginal) {
    tags.push({
      slug: "original",
    });
  }

  if (pixivResult.body.aiType === 2) {
    tags.push({
      slug: "AI-generated",
    });
  }

  if (pixivResult.body.tags && pixivResult.body.tags.tags) {
    for (const tag of pixivResult.body.tags.tags) {
      const slug
        = (tag.translation && tag.translation.en) || tag.romaji || tag.tag;

      if (tags.some((value) => value.slug === slug)) {
        continue;
      }

      tags.push({
        slug,
      });
    }
  }

  return {
    title: pixivResult.body.illustTitle,
    source: `https://www.pixiv.net/en/artworks/${pixivResult.body.illustId}`,
    tags,
  };
};

export const getPixivMetadata = async (
  pixivId: string,
): Promise<ImageMeta | null> => {
  const pixivResult = await fetchPixiv(pixivId);

  return toImageMeta(pixivResult, pixivId);
};
