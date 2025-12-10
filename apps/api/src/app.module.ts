import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { CoreModule } from './core/core.module'
import { validateEnvVars } from './core/env/env.validation'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    CoreModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `apps/api/.env.${process.env.NODE_ENV || 'development'}`,
      validate: validateEnvVars,
      cache: true,
      validationOptions: {
        allowUnknown: false,
      },
      validatePredefined: false,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 1000, limit: 3 },
        { name: 'middle', ttl: 10000, limit: 15 },
        { name: 'long', ttl: 60000, limit: 100 },
      ],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
