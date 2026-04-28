import { resolve } from "node:path"
import dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: resolve(__dirname, ".env") })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables")
}

export default defineConfig({
  out: "./src/lib/migrations",
  schema: "./src/lib/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  casing: "snake_case",
})
