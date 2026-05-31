import { UserRoles } from "@ecommerce/data-access"
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"

import { MetadataKeys } from "../../../shared/constants"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      MetadataKeys.ROLE_KEY,
      [context.getHandler(), context.getClass()]
    )

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    return requiredRoles.length ? requiredRoles.includes(user.role) : true
  }
}
