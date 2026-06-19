import type { ValueOfSet } from "@ecommerce/utils"
import { HttpStatus } from "@nestjs/common"
import type { z } from "zod"

export const ValidationErrorCodes = new Set([
  "REQUEST_VALIDATION_ERROR",
  "INCORRECT_SOURCE_APP",
] as const)
export type ValidationErrorCodes = ValueOfSet<typeof ValidationErrorCodes>

export class RequestValidationException extends Error {
  readonly code: ValidationErrorCodes = "REQUEST_VALIDATION_ERROR"
  readonly status = HttpStatus.BAD_REQUEST

  constructor(readonly details: ReturnType<typeof z.treeifyError>) {
    super("Request validation failed")
  }
}

export class IncorrectSourceAppException extends Error {
  readonly code: ValidationErrorCodes = "INCORRECT_SOURCE_APP"
  readonly status = HttpStatus.BAD_REQUEST

  constructor() {
    super('Invalid "X-App-Source" header value. Must be "shop" or "admin"')
  }
}
