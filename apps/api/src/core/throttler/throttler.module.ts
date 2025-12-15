import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import {
  ThrottlerGuard,
  ThrottlerModule as NestThrottlerModule,
} from '@nestjs/throttler'

@Module({
  imports: [
    NestThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 1000, limit: 3 },
        { name: 'middle', ttl: 10000, limit: 15 },
        { name: 'long', ttl: 60000, limit: 100 },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerModule {}
