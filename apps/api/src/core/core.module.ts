import { Module } from '@nestjs/common'

import { EnvModule } from './env/env.module'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [EnvModule, LoggerModule],
  providers: [],
  exports: [EnvModule, LoggerModule],
})
export class CoreModule {}
