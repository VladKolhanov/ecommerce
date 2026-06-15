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

export const findFirstByEmailSchemaInput = z.object({
  email: zEmail(),
})
export const findFirstByEmailSchemaResponse = z.object({
  id: z.uuid(),
  email: zEmail(),
  role: z.enum(userRoleEnum),
})
export class FindFirstByEmailInputDto extends createZodDto(
  findFirstByEmailSchemaInput
) {}
export class FindFirstByEmailResponseDto extends createZodDto(
  findFirstByEmailSchemaResponse
) {}
export type FindFirstByEmailInput = z.infer<typeof findFirstByEmailSchemaInput>
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
