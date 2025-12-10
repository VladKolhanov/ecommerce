import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvConfig } from '@/core/env/env.validation'

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  get port() {
    return this.configService.getOrThrow('PORT', { infer: true })
  }

  get globalPrefix() {
    return this.configService.getOrThrow('GLOBAL_PREFIX', {
      infer: true,
    })
  }

  get isDev() {
    return (
      this.configService.getOrThrow('NODE_ENV', { infer: true }) ===
      'development'
    )
  }

  get apiVersion() {
    return this.configService.getOrThrow('API_VERSION', { infer: true })
  }
}
