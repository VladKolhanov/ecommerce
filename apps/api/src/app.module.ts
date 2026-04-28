import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"

import { CoreModule } from "./core/core.module"
import { AuthModule } from "./modules/auth/auth.module"
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard"
import { HealthModule } from "./modules/health/health.module"
import { UserModule } from "./modules/user/user.module"

@Module({
  imports: [CoreModule, HealthModule, UserModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
