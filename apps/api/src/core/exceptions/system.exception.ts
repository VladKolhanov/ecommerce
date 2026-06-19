import type { ValueOfSet } from "@ecommerce/utils"
import { HttpStatus } from "@nestjs/common"

export const SystemErrorCodes = new Set([
  "INTERNAL_SERVER_ERROR",
  "SERIALIZATION_ERROR",
] as const)
export type SystemErrorCodes = ValueOfSet<typeof SystemErrorCodes>

export abstract class SystemException extends Error {
  abstract readonly code: SystemErrorCodes
  abstract readonly status: HttpStatus
  abstract readonly publicMessage: string

  constructor(message: string) {
    super(message)
  }
}

export class InternalServerException extends SystemException {
  readonly code: SystemErrorCodes = "INTERNAL_SERVER_ERROR"
  readonly status = HttpStatus.INTERNAL_SERVER_ERROR
  readonly publicMessage = "Something went wrong"

  constructor(message: string) {
    super(message)
  }
}

export class ResponseSerializationException extends SystemException {
  readonly code: SystemErrorCodes = "SERIALIZATION_ERROR"
  readonly status = HttpStatus.INTERNAL_SERVER_ERROR
  readonly publicMessage = "Something went wrong"

  constructor() {
    super("Response serialization failed")
  }
}
