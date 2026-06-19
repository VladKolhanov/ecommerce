import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

import { IncorrectSourceAppException } from "../../core/exceptions/validation.exception"
import type { AppSourceType } from "../types"

export const AppSource = createParamDecorator(
  (_, context: ExecutionContext): AppSourceType => {
    const request = context.switchToHttp().getRequest()

    const source = request.headers["x-app-source"] as unknown

    if (!source || (source !== "shop" && source !== "admin")) {
      throw new IncorrectSourceAppException()
    }

    return source
  }
)
