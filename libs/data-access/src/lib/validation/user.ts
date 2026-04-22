import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod/v4"

import { userTable } from "../schemas/auth"

const userInsertBaseSchema = createInsertSchema(userTable, {
  email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase()
    .min(5, "Email is too short")
    .max(254, "Email is too long"),

  password: (schema) =>
    schema
      .min(8, "Password must be at least 8 characters long")
      .max(72, "Password is too long"),
})
const userSelectBaseSchema = createSelectSchema(userTable, {})

export const createUserSchema = userInsertBaseSchema.pick({
  email: true,
  password: true,
})
export const findUserByEmailSchema = userSelectBaseSchema.pick({ email: true })
export const findUserByIdSchema = userSelectBaseSchema.pick({ id: true })
export const deleteUserSchema = userSelectBaseSchema.pick({ id: true })

export type UserSelectSchema = InferSelectModel<typeof userTable>
export type UserInsertSchema = InferInsertModel<typeof userTable>
export type CreateUser = z.infer<typeof createUserSchema>
export type FindUserByEmail = z.infer<typeof findUserByEmailSchema>
export type FindUserById = z.infer<typeof findUserByIdSchema>
export type DeleteUser = z.infer<typeof deleteUserSchema>
