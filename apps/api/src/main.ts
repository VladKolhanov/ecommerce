import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { EnvService } from './core/env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const apiConfigService = app.get(EnvService)

  const port = apiConfigService.port
  const globalPrefix = apiConfigService.globalPrefix

  app.setGlobalPrefix(globalPrefix)
  app.enableShutdownHooks()

  await app.listen(port)

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
