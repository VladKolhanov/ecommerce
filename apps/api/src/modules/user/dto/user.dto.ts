import { userResponseSchema, userSelectSchema } from "@ecommerce/data-access"
import { createZodDto } from "nestjs-zod"

export class FindOneUserByEmailDto extends createZodDto(
  userSelectSchema.pick({ email: true })
) {}

export class FindOneUserByIdDto extends createZodDto(
  userSelectSchema.pick({ id: true })
) {}

export class DeleteUserDto extends createZodDto(
  userSelectSchema.pick({ id: true })
) {}

export class UserResponseDto extends createZodDto(userResponseSchema) {}
