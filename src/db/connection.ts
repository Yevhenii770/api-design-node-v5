import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'
import { env, isProd } from '../../env.ts'
import { remember } from '@epic-web/remember'

// Function that creates a new Postgres connection pool
const createPool = () => {
  return new Pool({
    connectionString: env.DATABASE_URL,
  })
}

let client

// If environment is production...
if (isProd()) {
  client = createPool()
  // In production: always create a brand-new DB pool.
} else {
  // In development: reuse the same pool if it already exists.
  // "remember" stores the pool in a global-like cache between hot reloads.
  client = remember('dbPool', () => createPool())
  // This prevents creating new DB connections every time the server reloads.
}

// Create the Drizzle ORM instance using the Postgres client + schema
export const db = drizzle(client, { schema })

// Export it as the default for easy importing
export default db
