import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CoreModule } from './core/core.module'
import { validateEnvVars } from './core/env/env.validation'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    CoreModule,
    HealthModule,
    ConfigModule.forRoot({
      envFilePath: `apps/api/.env.${process.env.NODE_ENV || 'development'}`,
      validate: validateEnvVars,
      cache: true,
      validationOptions: {
        allowUnknown: false,
      },
      validatePredefined: false,
    }),
  ],
})
export class AppModule {}
