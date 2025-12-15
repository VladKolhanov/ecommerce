import { Module } from '@nestjs/common'

import { CoreModule } from './core/core.module'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [CoreModule, HealthModule],
  providers: [],
})
export class AppModule {}
