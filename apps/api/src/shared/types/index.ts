import type { UserRoles } from "@ecommerce/data-access"

export type AppSourceType = "shop" | "admin"

export interface JwtAuthPayload {
  sub: string
  role: UserRoles
  type: "AUTH"
}

export interface JwtTwoFactorPayload {
  sub: string
  role: UserRoles
  type: "TWO_FACTOR"
}
