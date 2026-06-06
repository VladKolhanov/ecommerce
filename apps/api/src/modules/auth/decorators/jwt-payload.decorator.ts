import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

import type { JwtAuthPayload as JwtPayloadType } from "../../../shared/types"

export const JwtPayload = createParamDecorator(
  (
    key: keyof JwtPayloadType | undefined,
    context: ExecutionContext
  ): JwtPayloadType | Partial<JwtPayloadType> => {
    const request = context.switchToHttp().getRequest()

    return key ? request.user[key] : request.user
  }
)
