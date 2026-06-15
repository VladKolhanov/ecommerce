import type { Roles as TRoles } from "@ecommerce/data-access"
import { SetMetadata } from "@nestjs/common"

import { MetadataKeys } from "../../../shared/constants"

export const Roles = (...roles: TRoles[]) =>
  SetMetadata(MetadataKeys.ROLE_KEY, roles)
