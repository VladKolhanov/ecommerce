import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'
import { EnvService } from './core/env/env.service'
import { setupSwagger } from './core/swagger/setup-swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const apiConfigService = app.get(EnvService)

  const port = apiConfigService.port
  const globalPrefix = apiConfigService.globalPrefix

  app.useLogger(app.get(Logger))
  app.setGlobalPrefix(globalPrefix)
  app.enableVersioning({
    defaultVersion: apiConfigService.apiVersion,
    type: VersioningType.URI,
  })
  app.enableShutdownHooks()
  setupSwagger(app)

  await app.listen(port)
}

bootstrap()
