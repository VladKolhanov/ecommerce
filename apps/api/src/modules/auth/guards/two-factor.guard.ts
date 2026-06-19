import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { EnvService } from "../../../core/env/env.service"
import {
  AuthInvalidHeaderException,
  AuthInvalidTFATokenException,
} from "../../../core/exceptions/domain.exception"
import { JwtTokens } from "../../../shared/types"

@Injectable()
export class TwoFactorGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthInvalidHeaderException()
    }

    const token = authHeader.split(" ")[1]

    try {
      const payload = await this.jwtService.verifyAsync<JwtTokens>(token, {
        secret: this.envService.jwtTwoFactorSecret,
      })

      if (payload.type !== "TWO_FACTOR") {
        throw new AuthInvalidTFATokenException()
      }
      request["twoFactorUser"] = payload

      return true
    } catch {
      throw new AuthInvalidTFATokenException()
    }
  }
}
