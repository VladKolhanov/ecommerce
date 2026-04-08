import { z } from "zod"

export const zStringRequired = () =>
  z.string().trim().min(1, { message: "is required field" })
export const zStringOptional = () => z.string().trim().optional()
