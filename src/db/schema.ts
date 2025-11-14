import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  //id will be in ORM : uuid('id') will be in DB
  id: uuid('id').primaryKey().defaultRandom(),
  // notNull means this column cannot be NULL in the database
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  // defaultNow will set the default value to the current timestamp
  createdAt: timestamp('created_at').notNull().defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().notNull(),
})

export const habits = pgTable('habits', {
  //id will be in ORM : uuid('id') will be in DB
  id: uuid('id').primaryKey().defaultRandom(),
  //asociated to user
  // reference to users table, foreign key, onDelete means if the user is deleted, delete all their habits
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  frequency: varchar('frequency', { length: 20 }).notNull(),
  //integer = what is your goal
  targetCount: integer('target_count').default(1),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().notNull(),
})

export const entries = pgTable('entries', {
  //id will be in ORM : uuid('id') will be in DB
  id: uuid('id').primaryKey().defaultRandom(),

  habitId: uuid('habit_id')
    .references(() => habits.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completionDate: timestamp('completion_date').defaultNow(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tags = pgTable('tags', {
  //id will be in ORM : uuid('id') will be in DB
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 7 }).default('#6b7280'),
  createdAt: timestamp('created_at').notNull().defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().notNull(),
})

export const habitTags = pgTable('habitTtags', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow().notNull(),
})

//RELATIONSHIPS

//relation between users and habits, query users will return habits as well
export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}))

//relations between habits and user(revert) and habits and entries
export const habitsRelation = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  entries: many(entries),
  habitTags: many(habitTags),
}))

// Relation between entries and habits:
// Each "entry" (log of completing a habit) is linked to a single "habit".
// A habit can have many entries, but each entry belongs to exactly one habit.
export const entriesRelation = relations(entries, ({ one }) => ({
  habit: one(habits, {
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

// Tags and habitTags
export const tagsRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}))

// habitTags to habit and habitTags to tag
export const habitTagsRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, {
    fields: [habitTags.habitId],
    references: [habits.id],
  }),
  tag: one(tags, {
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}))

//create a TypeScript types by tables
export type User = typeof users.$inferSelect
export type Habit = typeof habits.$inferSelect
export type Entry = typeof entries.$inferSelect
export type Tag = typeof tags.$inferSelect
export type HabitTag = typeof habitTags.$inferSelect

// Validates data before inserting into "users" (no id, only user input)
export const insertUserSchema = createInsertSchema(users)
// Validates data selected from DB (includes id, timestamps, all fields)
export const selectUserSchema = createInsertSchema(users)
