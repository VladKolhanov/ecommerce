import type { ValueOfSet } from "@ecommerce/utils"
import { HttpStatus } from "@nestjs/common"

export const DomainErrorCodes = new Set([
  "USER_NOT_FOUND",
  "AUTH_INVALID_CREDENTIALS",
  "AUTH_INVALID_HEADER",
  "AUTH_ACCESS_DENIED",
  "AUTH_TOTP_FAILED",
  "AUTH_INVALID_TOKEN",
] as const)
export type DomainErrorCodes = ValueOfSet<typeof DomainErrorCodes>

export abstract class DomainException extends Error {
  abstract readonly code: DomainErrorCodes
  abstract readonly status: HttpStatus
}

/**
 * User
 */

export class UserNotFoundException extends DomainException {
  readonly code: DomainErrorCodes = "USER_NOT_FOUND"
  readonly status = HttpStatus.NOT_FOUND

  constructor() {
    super("User not found")
  }
}

/**
 * Auth
 */

export class AuthInvalidCredentialsException extends DomainException {
  readonly code: DomainErrorCodes = "AUTH_INVALID_CREDENTIALS"
  readonly status = HttpStatus.UNAUTHORIZED

  constructor() {
    super("Invalid credentials")
  }
}

export class AuthInvalidHeaderException extends DomainException {
  readonly code: DomainErrorCodes = "AUTH_INVALID_HEADER"
  readonly status = HttpStatus.UNAUTHORIZED

  constructor() {
    super("Missing or invalid auth header")
  }
}

export class AuthAccessDeniedException extends DomainException {
  readonly code: DomainErrorCodes = "AUTH_ACCESS_DENIED"
  readonly status = HttpStatus.FORBIDDEN

  constructor() {
    super("Access denied")
  }
}

export class AuthTOTPFailedException extends DomainException {
  readonly code: DomainErrorCodes = "AUTH_TOTP_FAILED"
  readonly status = HttpStatus.UNAUTHORIZED

  constructor() {
    super("TOTP failed")
  }
}

export class AuthInvalidTokenException extends DomainException {
  readonly code: DomainErrorCodes = "AUTH_INVALID_TOKEN"
  readonly status = HttpStatus.UNAUTHORIZED

  constructor() {
    super("Invalid refresh token")
  }
}
