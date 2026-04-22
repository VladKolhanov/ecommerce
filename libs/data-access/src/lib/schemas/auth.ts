import { relations } from "drizzle-orm"
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { timestamps } from "./_helpers"

export const rolesEnum = pgEnum("roles", ["user", "manager", "admin"])

export const userTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  roles: rolesEnum("role").default("user").notNull(),
  ...timestamps,
})

export const tokenTable = pgTable("tokens", {
  id: uuid().defaultRandom().primaryKey(),
  token: varchar("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
})

export const tokenRelations = relations(tokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [tokenTable.userId],
    references: [userTable.id],
  }),
}))
