import {
  createUserSchema,
  deleteUserSchema,
  findUserByEmailSchema,
  findUserByIdSchema,
} from "@ecommerce/data-access"
import { createZodDto } from "nestjs-zod"

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class FindOneUserByEmailDto extends createZodDto(
  findUserByEmailSchema
) {}
export class FindOneUserByIdDto extends createZodDto(findUserByIdSchema) {}
export class DeleteUserDto extends createZodDto(deleteUserSchema) {}
