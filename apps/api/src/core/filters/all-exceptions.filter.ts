import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"
import { Logger } from "nestjs-pino"
import { ZodSerializationException } from "nestjs-zod"

import { ErrorResponse } from "../../shared/types"
import { EnvService } from "../env/env.service"
import { DomainException } from "../exceptions/domain.exception"
import {
  ResponseSerializationException,
  SystemException,
} from "../exceptions/system.exception"
import {
  IncorrectSourceAppException,
  RequestValidationException,
} from "../exceptions/validation.exception"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
    private readonly envService: EnvService
  ) {}

  catch(
    exception:
      | DomainException
      | SystemException
      | RequestValidationException
      | Error,
    host: ArgumentsHost
  ): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let responseBody: ErrorResponse = {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "Something went wrong",
        ...(this.envService.isDev && {
          details: {
            description: exception.message,
            stack: exception.stack,
          },
        }),
      },
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    }

    const isDomainException = exception instanceof DomainException
    const isSystemException = exception instanceof SystemException
    const isZodSerializationException =
      exception instanceof ZodSerializationException
    const isRequestValidationException =
      exception instanceof RequestValidationException
    const isIncorrectSourceAppException =
      exception instanceof IncorrectSourceAppException

    if (isDomainException) {
      status = exception.status
      responseBody = {
        ...responseBody,
        error: { code: exception.code, message: exception.message },
      }
    }

    if (isSystemException) {
      status = exception.status
      responseBody = {
        ...responseBody,
        error: {
          code: exception.code,
          message: exception.publicMessage,
          ...(this.envService.isDev && {
            details: {
              description: exception.message,
              stack: exception.stack,
            },
          }),
        },
      }
    }

    if (isRequestValidationException) {
      status = exception.status
      responseBody = {
        ...responseBody,
        error: {
          code: exception.code,
          message: exception.message,
          details: exception.details,
        },
      }
    }

    if (isIncorrectSourceAppException) {
      status = exception.status
      responseBody = {
        ...responseBody,
        error: {
          code: exception.code,
          message: exception.message,
        },
      }
    }

    if (isZodSerializationException) {
      const exception = new ResponseSerializationException()

      status = exception.status
      responseBody = {
        ...responseBody,
        error: {
          code: exception.code,
          message: exception.publicMessage,
          ...(this.envService.isDev && {
            details: {
              description: exception.message,
              stack: exception.stack,
            },
          }),
        },
      }
    }

    if (isDomainException) {
      this.logger.warn({
        err: exception,
        req: request,
        path: request.originalUrl,
      })
    }

    if (
      isSystemException ||
      isZodSerializationException ||
      responseBody.error.code === "UNKNOWN_ERROR"
    ) {
      this.logger.error({
        err: exception,
        req: request,
        path: request.originalUrl,
      })
    }

    httpAdapter.reply(response, responseBody, status)
  }
}
