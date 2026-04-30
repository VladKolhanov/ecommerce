import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod"
import type { z } from "zod/v4"

import { userTable } from "../schemas/auth"

export const userInsertSchema = createInsertSchema(userTable, {})
export const userSelectSchema = createSelectSchema(userTable, {})
export const userUpdateSchema = createUpdateSchema(userTable, {})

export const userResponseSchema = userSelectSchema.pick({
  id: true,
  email: true,
  role: true,
})

export type UserSelectSchema = z.infer<typeof userSelectSchema>
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>
export type UserInsertSchema = z.infer<typeof userInsertSchema>
export type UserResponseSchema = z.infer<typeof userResponseSchema>
