import { Module } from '@nestjs/common'

import { EnvModule } from './env/env.module'
import { AllExceptionsFilterProvider } from './filters/all-exceptions.provider'
import { LoggerModule } from './logger/logger.module'
import { ThrottlerModule } from './throttler/throttler.module'
import { ValidationPipeModule } from './validation-pipe/validation-pipe.module'

@Module({
  imports: [EnvModule, LoggerModule, ThrottlerModule, ValidationPipeModule],
  exports: [EnvModule, LoggerModule, ThrottlerModule, ValidationPipeModule],
  providers: [AllExceptionsFilterProvider],
})
export class CoreModule {}
