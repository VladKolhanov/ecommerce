import type { tokenTable, userTable } from "./schemas/auth"
import type { userRoleEnum } from "./validation/auth"

export type UserRoles = (typeof userRoleEnum)[number]
export type UserSelect = typeof userTable.$inferSelect
export type UserInsert = typeof userTable.$inferInsert
export type RefreshTokenSelect = typeof tokenTable.$inferSelect
export type RefreshTokenInsert = typeof tokenTable.$inferInsert
