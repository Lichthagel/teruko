CREATE TABLE `Image` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`title` text,
	`source` text,
	`createdAt` integer DEFAULT (unixepoch('now')) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch('now')) NOT NULL,
	`height` integer NOT NULL,
	`width` integer NOT NULL
) STRICT;
--> statement-breakpoint
CREATE UNIQUE INDEX `Image_filename_unique` ON `Image` (`filename`);--> statement-breakpoint
CREATE INDEX `Image_createdAt_idx` ON `Image` (`createdAt`);--> statement-breakpoint
CREATE TABLE `Tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`categorySlug` text,
	FOREIGN KEY (`categorySlug`) REFERENCES `TagCategory`(`slug`) ON UPDATE cascade ON DELETE set null
) STRICT;
--> statement-breakpoint
CREATE UNIQUE INDEX `Tag_slug_unique` ON `Tag` (`slug`);--> statement-breakpoint
CREATE TABLE `TagCategory` (
	`slug` text PRIMARY KEY NOT NULL,
	`color` text
) STRICT;
--> statement-breakpoint
CREATE TABLE `_ImageToTag` (
	`imageId` integer NOT NULL,
	`tagId` integer NOT NULL,
	PRIMARY KEY(`imageId`, `tagId`),
	FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON UPDATE cascade ON DELETE cascade
) STRICT;
