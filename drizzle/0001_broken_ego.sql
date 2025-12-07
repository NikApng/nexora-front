CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`language` text NOT NULL,
	`stack` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
