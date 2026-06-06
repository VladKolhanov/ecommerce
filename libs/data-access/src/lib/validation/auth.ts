import {
  zEmail,
  zPassword,
  zStringOptional,
  zStringRequired,
} from "@ecommerce/utils"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

import { rolesEnum } from "../schemas/auth"

export const userRoleEnum = rolesEnum.enumValues

/**
 * Registration
 */

export const registerSchemaInput = z
  .object({
    email: zEmail(),
    password: zPassword(),
    confirmPassword: z.string().min(1, "is Required"),
  })
  .refine((field) => field.password === field.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export const registerSchemaResponse = z.object({
  accessToken: zStringRequired(),
})
export class RegisterInputDto extends createZodDto(registerSchemaInput) {}
export class RegisterResponseDto extends createZodDto(registerSchemaResponse) {}
export type RegisterInput = z.infer<typeof registerSchemaInput>
export type RegisterResponse = z.infer<typeof registerSchemaResponse>

/**
 * Login
 */

export const loginSchemaInput = z.object({
  email: zEmail(),
  password: zPassword(),
})
export const loginSchemaResponse = z.object({
  success: z.boolean(),
  accessToken: zStringOptional(),
})
export class LoginInputDto extends createZodDto(loginSchemaInput) {}
export class LoginResponseDto extends createZodDto(loginSchemaResponse) {}
export type LoginInput = z.infer<typeof loginSchemaInput>
export type LoginResponse = z.infer<typeof loginSchemaResponse>

/**
 * Logout
 */

export const logoutSchemaResponse = z.object({
  success: z.boolean(),
})
export class LogoutResponseDto extends createZodDto(logoutSchemaResponse) {}
export type LogoutResponse = z.infer<typeof logoutSchemaResponse>

/**
 * Refresh
 */

export const refreshTokenSchemaResponse = z.object({
  accessToken: zStringRequired(),
})
export class RefreshTokenResponseDto extends createZodDto(
  refreshTokenSchemaResponse
) {}
export type RefreshTokenResponse = z.infer<typeof refreshTokenSchemaResponse>

/**
 * TwoFactor - setup
 */

export const twoFactorSetupSchemaResponse = z.object({
  qrcode: zStringOptional(),
})
export class TwoFactorSetupResponseDto extends createZodDto(
  twoFactorSetupSchemaResponse
) {}
export type TwoFactorSetupResponse = z.infer<
  typeof twoFactorSetupSchemaResponse
>

/**
 * TwoFactor - verify
 */

export const twoFactorVerifySchemaInput = z.object({
  code: zStringRequired(),
})
export const twoFactorVerifySchemaResponse = z.object({
  accessToken: zStringRequired,
})
export class TwoFactorVerifyInputDto extends createZodDto(
  twoFactorVerifySchemaInput
) {}
export class TwoFactorVerifyResponseDto extends createZodDto(
  twoFactorVerifySchemaResponse
) {}
export type TwoFactorVerifyInput = z.infer<typeof twoFactorVerifySchemaInput>
export type TwoFactorVerifyResponse = z.infer<
  typeof twoFactorVerifySchemaResponse
>
