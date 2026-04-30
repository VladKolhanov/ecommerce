import { ErrorCode } from "./codes.enum"

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error",
  [ErrorCode.VALIDATION_ERROR]: "Invalid data format provided",
} as const

export const HTTP_ERROR_MESSAGES = {
  AUTH_INVALID_CREDENTIALS: "Invalid credentials",
} as const
