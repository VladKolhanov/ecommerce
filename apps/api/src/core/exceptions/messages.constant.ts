import { ErrorCode } from "./codes.enum"

export const ErrorMessages = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error",
  [ErrorCode.VALIDATION_ERROR]: "Invalid data format provided",
  [ErrorCode.USER_NOT_FOUND]: "User not found",
} as const satisfies Record<ErrorCode, string>

export const HTTP_ERROR_MESSAGES = {
  AUTH_INVALID_CREDENTIALS: "Invalid credentials",
  AUTH_INVALID_HEADER: "Missing or invalid auth header",
  AUTH_TOKEN_EXPIRED: "Token is expired or invalid",
  AUTH_INVALID_TOKEN: "Invalid token type",
  AUTH_INVALID_TFA: "Invalid two-factor authentication code",
  AUTH_TFA_IS_NOT_SET_UP: "2FA is not set up for this account",
} as const
