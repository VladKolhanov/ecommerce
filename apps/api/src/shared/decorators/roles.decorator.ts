import type { UserRoles } from "@ecommerce/data-access"
import { SetMetadata } from "@nestjs/common"

import { ROLES_KEY } from "../constants"

export const Roles = (...role: UserRoles[]) => SetMetadata(ROLES_KEY, role)
