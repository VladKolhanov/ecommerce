import type { UserRoles } from "@ecommerce/data-access"

export const Roles = {
  USER: "user",
  MANAGER: "manager",
  ADMIN: "admin",
} as const satisfies Record<Uppercase<UserRoles>, UserRoles>

export const MetadataKeys = {
  ROLE_KEY: "role",
} as const
