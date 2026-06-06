import { z } from "zod"

export const zStringRequired = () =>
  z.string().trim().min(1, { message: "is required field" })

export const zStringOptional = () => z.string().trim().optional()

export const zEmail = () =>
  z
    .email("Invalid Email")
    .trim()
    .toLowerCase()
    .min(5, "Too short")
    .max(254, "Too long")

export const zPassword = () =>
  z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")

export const tryCatch = async <T>(
  promise: Promise<T>
): Promise<readonly [T, null] | readonly [null, unknown]> => {
  try {
    return [await promise, null] as const
  } catch (error) {
    return [null, error] as const
  }
}
