import { zEmail, zStringRequired } from "@ecommerce/utils"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

import { userRoleEnum } from "./auth"

/**
 * FindFirstById
 */

export const findFirstByIdSchemaResponse = z.object({
  id: zStringRequired(),
  email: zEmail(),
  role: z.enum(userRoleEnum),
})
export class FindFirstByIdResponseDto extends createZodDto(
  findFirstByIdSchemaResponse
) {}
export type FindFirstByIdResponse = z.infer<typeof findFirstByIdSchemaResponse>

/**
 * FindFirstByEmail
 */

export const findFirstByEmailSchemaInput = z.object({
  email: zEmail(),
})
export const findFirstByEmailSchemaResponse = z.object({
  id: zStringRequired(),
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
export class DeleteResponseDto extends createZodDto(deleteSchemaResponse) {}
export type DeleteResponse = z.infer<typeof deleteSchemaResponse>
