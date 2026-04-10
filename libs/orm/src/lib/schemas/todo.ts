import { pgTable, text, varchar } from "drizzle-orm/pg-core"

import { timestamps } from "./_helpers"

export const todo = pgTable("todo", {
  id: text("id").primaryKey(),
  text: varchar("text").notNull(),
  ...timestamps,
})
