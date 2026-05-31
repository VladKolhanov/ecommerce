import type { UserRoles } from "@ecommerce/data-access"
import { SetMetadata } from "@nestjs/common"

import { MetadataKeys } from "../../../shared/constants"

export const Roles = (...roles: UserRoles[]) =>
  SetMetadata(MetadataKeys.ROLE_KEY, roles)
