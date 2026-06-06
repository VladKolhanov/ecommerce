import {
  BadRequestException,
  createParamDecorator,
  type ExecutionContext,
} from "@nestjs/common"

import type { AppSourceType } from "../types"

export const AppSource = createParamDecorator(
  (_, context: ExecutionContext): AppSourceType => {
    const request = context.switchToHttp().getRequest()

    const source = request.headers["x-app-source"] as unknown

    if (!source) {
      throw new BadRequestException('Missing "X-App-Source" header')
    }

    if (source !== "shop" && source !== "admin") {
      throw new BadRequestException(
        'Invalid "X-App-Source" header value. Must be "shop" or "admin"'
      )
    }

    return source
  }
)
