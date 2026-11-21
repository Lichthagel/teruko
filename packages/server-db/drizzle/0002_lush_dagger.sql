CREATE TABLE "TagAlias" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "TagAlias_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"tagId" bigint NOT NULL,
	"alias" text NOT NULL,
	CONSTRAINT "TagAlias_alias_unique" UNIQUE("alias")
);
--> statement-breakpoint
ALTER TABLE "TagAlias" ADD CONSTRAINT "TagAlias_tagId_Tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "TagAlias_alias_idx" ON "TagAlias" USING btree ("alias");