CREATE TABLE "Image" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"filename" text NOT NULL,
	"title" text,
	"source" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"height" integer NOT NULL,
	"width" integer NOT NULL,
	CONSTRAINT "Image_filename_unique" UNIQUE("filename")
);
--> statement-breakpoint
CREATE TABLE "Tag" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"categorySlug" text,
	CONSTRAINT "Tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "TagCategory" (
	"slug" text PRIMARY KEY NOT NULL,
	"color" text
);
--> statement-breakpoint
CREATE TABLE "_ImageToTag" (
	"imageId" bigint NOT NULL,
	"tagId" bigint NOT NULL,
	CONSTRAINT "_ImageToTag_pkey" PRIMARY KEY("imageId","tagId")
);
--> statement-breakpoint
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_categorySlug_TagCategory_slug_fk" FOREIGN KEY ("categorySlug") REFERENCES "public"."TagCategory"("slug") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ImageToTag" ADD CONSTRAINT "_ImageToTag_imageId_Image_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ImageToTag" ADD CONSTRAINT "_ImageToTag_tagId_Tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "Image_createdAt_idx" ON "Image" USING btree ("createdAt");