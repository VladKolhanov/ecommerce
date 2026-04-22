import { Module } from "@nestjs/common"

import { CoreModule } from "./core/core.module"
import { HealthModule } from "./modules/health/health.module"
import { UserModule } from "./modules/user/user.module"

@Module({
  imports: [CoreModule, HealthModule, UserModule],
  providers: [],
})
export class AppModule {}
