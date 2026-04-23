import { type TokenInsertSchema } from "@ecommerce/data-access"

export interface Tokens {
  accessToken: string
  refreshToken: TokenInsertSchema
}
