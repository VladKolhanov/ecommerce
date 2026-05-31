import type { UserRoles } from "@ecommerce/data-access"
import { applyDecorators, UseGuards } from "@nestjs/common"

import { Roles } from "./roles.decorator"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RolesGuard } from "../guards/roles.guard"

export function Protected(...roles: UserRoles[]) {
  return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard))
}
