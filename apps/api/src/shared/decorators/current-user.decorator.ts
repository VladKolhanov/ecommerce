import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

import type { JwtPayload } from "../../core/interfaces"

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayload | null,
    ctx: ExecutionContext
  ): JwtPayload | Partial<JwtPayload> => {
    const request = ctx.switchToHttp().getRequest()

    return key ? request.user[key] : request.user
  }
)
