import { Module } from "@nestjs/common"

import { AuthModule } from "./auth/auth.module"
import { HealthModule } from "./health/health.module"
import { UserModule } from "./user/user.module"
import { CoreModule } from "../core/core.module"

@Module({
  imports: [CoreModule, HealthModule, UserModule, AuthModule],
  providers: [],
})
export class AppModule {}
