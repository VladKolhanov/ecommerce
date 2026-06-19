import { zEmail } from "@ecommerce/utils"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

import { userRoleEnum } from "./auth"

/**
 * FindFirstById
 */

export const findFirstByIdSchemaResponse = z.object({
  id: z.uuid(),
  email: zEmail(),
  role: z.enum(userRoleEnum),
})
export const findFirstByIdSchemaParams = z.object({
  id: z.uuid(),
})
export class FindFirstByIdResponseDto extends createZodDto(
  findFirstByIdSchemaResponse
) {}
export class FindFirstByIdParamsDto extends createZodDto(
  findFirstByIdSchemaParams
) {}
export type FindFirstByIdResponse = z.infer<typeof findFirstByIdSchemaResponse>
export type FindFirstByIdParams = z.infer<typeof findFirstByIdSchemaParams>

/**
 * FindFirstByEmail
 */

export const findFirstByEmailSchemaQuery = z.object({
  email: zEmail(),
})
export const findFirstByEmailSchemaResponse = z.object({
  id: z.uuid(),
  email: zEmail(),
  role: z.enum(userRoleEnum),
})
export class FindFirstByEmailQueryDto extends createZodDto(
  findFirstByEmailSchemaQuery
) {}
export class FindFirstByEmailResponseDto extends createZodDto(
  findFirstByEmailSchemaResponse
) {}
export type FindFirstByEmailQuery = z.infer<typeof findFirstByEmailSchemaQuery>
export type FindFirstByEmailResponse = z.infer<
  typeof findFirstByEmailSchemaResponse
>

/**
 * Delete
 */

export const deleteSchemaResponse = z.object({
  success: z.boolean(),
})
export const deleteSchemaParams = z.object({
  id: z.uuid(),
})
export class DeleteResponseDto extends createZodDto(deleteSchemaResponse) {}
export class DeleteParamsDto extends createZodDto(deleteSchemaParams) {}
export type DeleteResponse = z.infer<typeof deleteSchemaResponse>
export type DeleteParams = z.infer<typeof deleteSchemaParams>
