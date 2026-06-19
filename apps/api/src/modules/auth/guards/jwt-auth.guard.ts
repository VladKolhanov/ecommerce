import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

import { AuthInvalidAccessTokenException } from "../../../core/exceptions/domain.exception"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  handleRequest<TUser = unknown>(err: unknown, user: unknown): TUser {
    if (err || !user) {
      throw new AuthInvalidAccessTokenException()
    }

    return user as TUser
  }
  async canActivate(context: ExecutionContext) {
    const result = await super.canActivate(context)

    return !!result
  }
}
