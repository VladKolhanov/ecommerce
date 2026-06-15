import type { Roles } from "@ecommerce/data-access"

import type { DomainErrorCodes } from "../../core/exceptions/domain.exception"
import type { SystemErrorCodes } from "../../core/exceptions/system.exception"
import type { ValidationErrorCodes } from "../../core/exceptions/validation.exception"

export type AppSourceType = "shop" | "admin"

export type SuccessResponse<T> = {
  success: true
  data: T
  timestamp: string
  path: string
}

export type ErrorResponse = {
  success: false
  error: {
    code:
      | DomainErrorCodes
      | SystemErrorCodes
      | ValidationErrorCodes
      | "UNKNOWN_ERROR"
    message: string
    details?: unknown
  }
  timestamp: string
  path: string
}

export interface JwtAuthPayload {
  sub: string
  role: Roles
  type: "AUTH"
}

export interface JwtTwoFactorPayload {
  sub: string
  role: Roles
  type: "TWO_FACTOR"
}

export type JwtTokens = JwtAuthPayload | JwtTwoFactorPayload
