import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod"
import type { z } from "zod/v4"

import { tokenTable } from "../schemas/auth"

export const tokenInsertSchema = createInsertSchema(tokenTable, {})
export const tokenSelectSchema = createSelectSchema(tokenTable, {})
export const tokenUpdateSchema = createUpdateSchema(tokenTable, {})

export type TokenSelectSchema = z.infer<typeof tokenSelectSchema>
export type TokenUpdateSchema = z.infer<typeof tokenUpdateSchema>
export type TokenInsertSchema = z.infer<typeof tokenInsertSchema>
