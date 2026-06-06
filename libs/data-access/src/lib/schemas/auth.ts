import { relations } from "drizzle-orm"
import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { timestamps } from "./_helpers"

export const rolesEnum = pgEnum("roles", ["user", "manager", "admin"])

export const userTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar("email").notNull().unique(),
  isTwoFactorEnabled: boolean("is_two_factor_enabled").notNull().default(false),
  twoFactorSecretKey: varchar("two_factor_secret_key"),
  password: varchar("password").notNull(),
  role: rolesEnum("role").default("user").notNull(),
  ...timestamps,
})

export const tokenTable = pgTable(
  "tokens",
  {
    id: uuid().defaultRandom().primaryKey(),
    token: varchar("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    userAgent: varchar("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => ({
    uniqueUserDevice: unique().on(t.userId, t.userAgent),
  })
)

export const tokenRelations = relations(tokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [tokenTable.userId],
    references: [userTable.id],
  }),
}))
