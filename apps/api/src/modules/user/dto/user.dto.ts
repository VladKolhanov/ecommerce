import { userInsertSchema, userSelectSchema } from "@ecommerce/data-access"
import { zEmail, zPassword } from "@ecommerce/utils"
import { createZodDto } from "nestjs-zod"

export class CreateUserDto extends createZodDto(
  userInsertSchema
    .pick({ email: true, password: true })
    .extend({ email: zEmail(), password: zPassword() })
) {}

export class FindOneUserByEmailDto extends createZodDto(
  userSelectSchema.pick({ email: true })
) {}

export class FindOneUserByIdDto extends createZodDto(
  userSelectSchema.pick({ id: true })
) {}

export class DeleteUserDto extends createZodDto(
  userSelectSchema.pick({ id: true })
) {}
