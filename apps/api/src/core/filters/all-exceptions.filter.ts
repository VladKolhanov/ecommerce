import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { AppException, ErrorCode, ErrorMessages } from '../exceptions'

type ErrorResponse = {
  status: HttpStatus
  code: ErrorCode | `HTTP_${HttpStatus}`
  message: string
  details: AppException['details']
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const responseBody: ErrorResponse = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      details: null,
    }

    if (exception instanceof AppException) {
      responseBody.status = exception.getStatus()
      responseBody.code = exception.code
      responseBody.message = exception.message
      responseBody.details = exception.details
    } else if (exception instanceof HttpException) {
      responseBody.status = exception.getStatus()
      responseBody.code = `HTTP_${responseBody.status}`
      responseBody.message = exception.message
    }

    if (responseBody.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Exception on ${httpAdapter.getRequestUrl(request)}`,
        exception instanceof Error ? exception.stack : String(exception)
      )
    }

    httpAdapter.reply(response, responseBody, responseBody.status)
  }
}
