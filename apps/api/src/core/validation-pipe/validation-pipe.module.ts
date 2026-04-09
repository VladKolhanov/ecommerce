import { Module } from "@nestjs/common"
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { ZodSerializerInterceptor } from "nestjs-zod"

import { ZodValidationPipe } from "./zod-validation-pipe"

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class ValidationPipeModule {}
