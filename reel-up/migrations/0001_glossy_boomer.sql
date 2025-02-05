-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"caption" text NOT NULL,
	"summary" text NOT NULL,
	"categories" text[],
	"embedding" vector(768),
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embedding_index" ON "videos" USING hnsw ("embedding" vector_cosine_ops);
