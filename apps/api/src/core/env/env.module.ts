import { Global, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { EnvService } from "./env.service"
import { validateEnvVars } from "./env.validation"

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        "apps/api/.env",
        `apps/api/.env.${process.env.NODE_ENV || "development"}`,
      ],
      validate: validateEnvVars,
      cache: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
