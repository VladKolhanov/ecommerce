import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { EnvService } from './core/env/env.service'
import { AppException } from './core/exceptions'
import { ErrorCode } from './core/exceptions/codes.enum'
import { setupSwagger } from './core/swagger/setup-swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const apiConfigService = app.get(EnvService)

  const port = apiConfigService.port
  const globalPrefix = apiConfigService.globalPrefix

  app.setGlobalPrefix(globalPrefix)
  app.enableVersioning({
    defaultVersion: apiConfigService.apiVersion,
    type: VersioningType.URI,
  })
  app.useGlobalPipes(
    new ValidationPipe({
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
  )

  app.enableShutdownHooks()
  setupSwagger(app)

  await app.listen(port)

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
