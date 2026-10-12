CREATE TABLE "TagRule" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "TagRule_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"tagId" bigint NOT NULL,
	"ruleKind" text NOT NULL,
	"otherTagId" bigint
);
--> statement-breakpoint
ALTER TABLE "TagRule" ADD CONSTRAINT "TagRule_tagId_Tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TagRule" ADD CONSTRAINT "TagRule_otherTagId_Tag_id_fk" FOREIGN KEY ("otherTagId") REFERENCES "public"."Tag"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "TagRule_otherTagId_idx" ON "TagRule" USING btree ("otherTagId");
