import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'

import { AppException, ErrorCode } from '@/core/exceptions'

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory() {
        return new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          exceptionFactory(errors) {
            const formattedErrors = errors.map((err) => ({
              field: err.property,
              errors: err.constraints,
            }))

            return new AppException({
              code: ErrorCode.VALIDATION_ERROR,
              details: formattedErrors,
            })
          },
        })
      },
    },
  ],
})
export class ValidationPipeModule {}
