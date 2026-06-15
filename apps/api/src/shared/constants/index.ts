import type { Roles as TRoles } from "@ecommerce/data-access"

export const Roles = {
  USER: "user",
  MANAGER: "manager",
  ADMIN: "admin",
} as const satisfies Record<Uppercase<TRoles>, TRoles>

export const MetadataKeys = {
  ROLE_KEY: "role",
} as const
