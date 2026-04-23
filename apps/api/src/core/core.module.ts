import { Module } from "@nestjs/common"

import { DbModule } from "./db/db.module"
import { EnvModule } from "./env/env.module"
import { AllExceptionsFilterProvider } from "./filters/all-exceptions.provider"
import { LoggerModule } from "./logger/logger.module"
import { ThrottlerModule } from "./throttler/throttler.module"
import { ValidationPipeModule } from "./validation-pipe/validation-pipe.module"

@Module({
  imports: [
    EnvModule,
    LoggerModule,
    ThrottlerModule,
    ValidationPipeModule,
    DbModule,
  ],
  exports: [
    EnvModule,
    LoggerModule,
    ThrottlerModule,
    ValidationPipeModule,
    DbModule,
  ],
  providers: [AllExceptionsFilterProvider],
})
export class CoreModule {}
