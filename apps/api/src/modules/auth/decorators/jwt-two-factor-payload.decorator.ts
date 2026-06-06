import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

import type { JwtTwoFactorPayload } from "../../../shared/types"

export const TwoFactorPayload = createParamDecorator(
  (_, context: ExecutionContext): JwtTwoFactorPayload => {
    const request = context.switchToHttp().getRequest()

    return request["twoFactorUser"]
  }
)
