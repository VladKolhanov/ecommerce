import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { EnvConfig } from "./env.validation"

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  get port() {
    return this.configService.getOrThrow("PORT", { infer: true })
  }

  get globalPrefix() {
    return this.configService.getOrThrow("GLOBAL_PREFIX", {
      infer: true,
    })
  }

  get isDev() {
    return (
      this.configService.getOrThrow("NODE_ENV", { infer: true }) ===
      "development"
    )
  }

  get apiVersion() {
    return this.configService.getOrThrow("API_VERSION", { infer: true })
  }

  get logLevel() {
    return this.configService.getOrThrow("LOG_LEVEL", { infer: true })
  }

  get logtailToken() {
    return this.configService.get("LOGTAIL_TOKEN", { infer: true })
  }

  get logtailHost() {
    return this.configService.get("LOGTAIL_HOST", { infer: true })
  }

  get jwtSecret() {
    return this.configService.getOrThrow("JWT_SECRET", { infer: true })
  }

  get jwtTokenExpire() {
    return this.configService.getOrThrow("JWT_TOKEN_EXPIRE", { infer: true })
  }

  get refreshTokenExpire() {
    return this.configService.getOrThrow("REFRESH_TOKEN_EXPIRE", {
      infer: true,
    })
  }

  get refreshTokenCookieKey() {
    return this.configService.getOrThrow("REFRESH_TOKEN_COOKIE_KEY", {
      infer: true,
    })
  }
}
