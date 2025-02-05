import { index, integer, pgTable, text, timestamp, varchar, vector } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: varchar('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const videosTable = pgTable('videos', {
  id: varchar('id').primaryKey(),
  title: text('title').notNull(),
  caption: text('caption').notNull(),
  summary: text('summary').notNull(),
  categories: text('categories').array(),
  embedding: vector('embedding', { dimensions: 768 }),
  userId: varchar('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at')
    .notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull().$onUpdate(() => new Date()),
},
(table) => [
  index('embedding_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
]
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertVideo = typeof videosTable.$inferInsert;
export type SelectVideo = typeof videosTable.$inferSelect;
