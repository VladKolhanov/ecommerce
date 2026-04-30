import { userInsertSchema, userResponseSchema } from "@ecommerce/data-access"
import { zEmail, zPassword } from "@ecommerce/utils"
import { createZodDto } from "nestjs-zod"
import z from "zod"

export class RegisterDto extends createZodDto(
  userInsertSchema
    .pick({ email: true, password: true })
    .extend({
      email: zEmail(),
      password: zPassword(),
      confirmPassword: z.string().min(1, "is Required"),
    })
    .refine((field) => field.password === field.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
) {}

export class RegisterResponseDto extends createZodDto(userResponseSchema) {}

export class LoginDto extends createZodDto(
  userInsertSchema.pick({ email: true, password: true }).extend({
    email: zEmail(),
    password: zPassword(),
  })
) {}
