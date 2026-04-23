import { Module } from "@nestjs/common"

import { CoreModule } from "./core/core.module"
import { AuthModule } from "./modules/auth/auth.module"
import { HealthModule } from "./modules/health/health.module"
import { UserModule } from "./modules/user/user.module"

@Module({
  imports: [CoreModule, HealthModule, UserModule, AuthModule],
  providers: [],
})
export class AppModule {}
