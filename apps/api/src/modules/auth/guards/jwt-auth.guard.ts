import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"

import { isPublic } from "../../../shared/decorators/public.decorator"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(ctx: ExecutionContext) {
    const _isPublic = isPublic(ctx, this.reflector)

    if (_isPublic) return true

    return (await super.canActivate(ctx)) as boolean
  }
}
