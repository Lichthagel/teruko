import { z } from "zod";

export const zImage = z.object({
  id: z.string().cuid2().or(z.number().positive().int()),
  filename: z.string(),
  title: z.string().nullable(),
  source: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  height: z.number().int(),
  width: z.number().int(),
});

export type Image = z.infer<typeof zImage>;

export const zTag = z.object({
  slug: z.string(),
  categorySlug: z.string().nullable(),
});

export type Tag = z.infer<typeof zTag>;

export const zTagCategory = z.object({
  slug: z.string(),
  color: z.string().nullable(),
});

export type TagCategory = z.infer<typeof zTagCategory>;

export const zImageSort = z.enum(["NEWEST", "OLDEST", "RANDOM"]);

export type ImageSort = z.infer<typeof zImageSort>;

export const zTagExt = zTag.extend({
  category: zTagCategory.nullish(),
});

export type TagExt = z.infer<typeof zTagExt>;

export const zImageExt = zImage.extend({
  tags: z.array(zTagExt).optional(),
});

export type ImageExt = z.infer<typeof zImageExt>;

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
  tags: meta.tags ? [...meta.tags, ...(meta2.tags ?? [])] : meta2.tags,
});
