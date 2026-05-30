import * as v from "valibot";

export const vImage = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  filename: v.string(),
  title: v.nullable(v.string()),
  source: v.nullable(v.string()),
  createdAt: v.date(),
  updatedAt: v.date(),
  height: v.pipe(v.number(), v.integer()),
  width: v.pipe(v.number(), v.integer()),
});

export type Image = v.InferOutput<typeof vImage>;

export const vTag = v.object({
  slug: v.string(),
  categorySlug: v.nullable(v.string()),
  approved: v.optional(v.boolean(), false),
});

export type Tag = v.InferOutput<typeof vTag>;

export const vTagCategory = v.object({
  slug: v.string(),
  color: v.nullable(v.string()),
});

export type TagCategory = v.InferOutput<typeof vTagCategory>;

export const vImageSort = v.picklist(["NEWEST", "OLDEST", "RANDOM"]);

export type ImageSort = v.InferOutput<typeof vImageSort>;

export const vTagExt = v.intersect([
  vTag,
  v.partial(v.object({
    category: v.nullable(vTagCategory),
    aliases: v.array(v.string()),
  })),
]);

export type TagExt = v.InferOutput<typeof vTagExt>;

export const vImageExt = v.intersect([
  vImage,
  v.partial(v.object({
    tags: v.array(vTagExt),
  })),
]);

export type ImageExt = v.InferOutput<typeof vImageExt>;

export type ImageMeta = {
  title?: string | null;
  source?: string | null;
  tags?:
    | {
      slug: string;
      categorySlug?: string | null;
    }[]
    | null;
};

export const mergeImageMeta = (
  meta: ImageMeta,
  meta2: ImageMeta,
): ImageMeta => ({
  title: meta.title ?? meta2.title,
  source: meta.source ?? meta2.source,
  tags: meta.tags
    ? [
        ...meta.tags,
        ...(meta2.tags?.filter(
          value =>
            meta.tags?.findIndex(value2 => value2.slug === value.slug) === -1,
        ) ?? []),
      ]
    : meta2.tags,
});
