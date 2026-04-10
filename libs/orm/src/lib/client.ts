import { drizzle as drizzlePgDriver } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schemas/todo"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables")
}

const dbClient = drizzlePgDriver(new Pool({ connectionString }), { schema })

export { dbClient }
