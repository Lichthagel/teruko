CREATE TABLE IF NOT EXISTS "Image" (
    id text NOT NULL,
    filename text NOT NULL,
    title text,
    source text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    width integer NOT NULL,
    height integer NOT NULL,
    CONSTRAINT "Image_pkey" PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS "Image_createdAt_idx" ON "Image" USING btree ("createdAt" DESC NULLS LAST);
CREATE UNIQUE INDEX IF NOT EXISTS "Image_filename_key" ON "Image" USING btree (
    filename ASC NULLS LAST
);
CREATE TABLE IF NOT EXISTS "TagCategory" (
    slug text NOT NULL,
    color text,
    CONSTRAINT "TagCategory_pkey" PRIMARY KEY (slug)
);
CREATE TABLE IF NOT EXISTS "Tag" (
    slug text NOT NULL,
    "categorySlug" text,
    CONSTRAINT "Tag_pkey" PRIMARY KEY (slug),
    CONSTRAINT "Tag_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "TagCategory" (slug) MATCH SIMPLE ON UPDATE CASCADE ON DELETE
    SET NULL
);
CREATE TABLE IF NOT EXISTS "_ImageToTag" (
    "A" text NOT NULL,
    "B" text NOT NULL,
    CONSTRAINT "_ImageToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Image" (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "_ImageToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" (slug) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "_ImageToTag_AB_unique" ON "_ImageToTag" USING btree (
    "A" ASC NULLS LAST,
    "B" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "_ImageToTag_B_index" ON "_ImageToTag" USING btree ("B" ASC NULLS LAST);
