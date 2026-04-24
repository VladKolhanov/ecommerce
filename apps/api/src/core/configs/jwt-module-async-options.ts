import type { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt"

import { EnvModule } from "../env/env.module"
import { EnvService } from "../env/env.service"

const jwtModuleOptions = (env: EnvService): JwtModuleOptions => ({
  secret: env.jwtSecret,
  signOptions: {
    expiresIn: env.jwtTokenExpire,
  },
})

export const options = (): JwtModuleAsyncOptions => ({
  imports: [EnvModule],
  useFactory: (env: EnvService) => jwtModuleOptions(env),
  inject: [EnvService],
})
