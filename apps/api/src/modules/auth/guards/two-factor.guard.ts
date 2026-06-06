import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { EnvService } from "../../../core/env/env.service"
import { HTTP_ERROR_MESSAGES } from "../../../core/exceptions/messages.constant"
import { JwtTwoFactorPayload } from "../../../shared/types"

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
      throw new UnauthorizedException(HTTP_ERROR_MESSAGES.AUTH_INVALID_HEADER)
    }

    const token = authHeader.split(" ")[1]

    try {
      const payload = await this.jwtService.verifyAsync<JwtTwoFactorPayload>(
        token,
        {
          secret: this.envService.jwtTwoFactorSecret,
        }
      )

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (payload.type !== "TWO_FACTOR") {
        throw new UnauthorizedException(HTTP_ERROR_MESSAGES.AUTH_INVALID_TOKEN)
      }

      request["twoFactorUser"] = payload

      return true
    } catch {
      throw new UnauthorizedException(HTTP_ERROR_MESSAGES.AUTH_TOKEN_EXPIRED)
    }
  }
}
