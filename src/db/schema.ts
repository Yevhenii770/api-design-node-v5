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
import { email } from 'zod'

export const users = pgTable('users', {
  //id will be in ORM : uuid('id') will be in DB
  id: uuid('id').primaryKey().defaultRandom,
  // notNull means this column cannot be NULL in the database
  email: varchar('email', { length: 255 }).notNull(),
})
