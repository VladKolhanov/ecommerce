import { HttpException, HttpStatus } from "@nestjs/common"

import type { ErrorCode } from "./codes.enum"
import { ErrorMessages } from "./messages.constant"

type AppExceptionDetails =
  | Record<PropertyKey, unknown>
  | Record<PropertyKey, unknown>[]

interface AppExceptionOptions {
  code: ErrorCode
  message?: string
  details?: AppExceptionDetails
  status?: HttpStatus
}

export class AppException extends HttpException {
  public readonly code: ErrorCode
  public readonly details: AppExceptionDetails | null

  constructor(options: AppExceptionOptions) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      options.message || ErrorMessages[options.code] || "Unknown error"
    const status = options.status || HttpStatus.BAD_REQUEST

    super(message, status)

    this.code = options.code
    this.details = options.details || null
  }
}
