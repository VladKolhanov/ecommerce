import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Logger } from 'nestjs-pino'

import { AppException, ErrorCode, ErrorMessages } from '../exceptions'

type ErrorResponse = {
  status: HttpStatus
  code: ErrorCode | `HTTP_${HttpStatus}`
  message: string
  details: AppException['details']
  traceId: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const responseBody: ErrorResponse = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      traceId: request.id || request.headers['x-request-id'] || null,
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
        {
          err: exception,
          req: request,
        },
        `Request failed on ${request.url}`
      )
    }

    httpAdapter.reply(response, responseBody, responseBody.status)
  }
}
