CREATE TABLE `TagRule` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tagId` integer NOT NULL,
	`ruleKind` text NOT NULL,
	`otherTagId` integer,
	FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`otherTagId`) REFERENCES `Tag`(`id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `TagRule_otherTagId_idx` ON `TagRule` (`otherTagId`);