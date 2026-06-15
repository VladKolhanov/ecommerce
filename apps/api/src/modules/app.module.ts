import { Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"

import { AuthModule } from "./auth/auth.module"
import { HealthModule } from "./health/health.module"
import { UserModule } from "./user/user.module"
import { CoreModule } from "../core/core.module"
import { ResponseInterceptor } from "../core/interceptors/response.interceptor"

@Module({
  imports: [CoreModule, HealthModule, UserModule, AuthModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
