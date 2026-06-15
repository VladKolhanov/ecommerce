import type { ValueOfSet } from "@ecommerce/utils"
import { HttpStatus } from "@nestjs/common"
import type { z } from "zod"

export const ValidationErrorCodes = new Set([
  "REQUEST_VALIDATION_ERROR",
] as const)
export type ValidationErrorCodes = ValueOfSet<typeof ValidationErrorCodes>

export class RequestValidationException extends Error {
  readonly code: ValidationErrorCodes = "REQUEST_VALIDATION_ERROR"
  readonly status = HttpStatus.BAD_REQUEST

  constructor(readonly details: ReturnType<typeof z.treeifyError>) {
    super("Request validation failed")
  }
}
