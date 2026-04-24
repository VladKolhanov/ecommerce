import {
  DB,
  TokenInsertSchema,
  TokenSelectSchema,
  tokenTable,
  UserInsertSchema,
  userTable,
} from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { add } from "date-fns"
import { eq } from "drizzle-orm"
import { v4 } from "uuid"

import { InjectDb } from "../../core/db/db.provider"

@Injectable()
export class AuthRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async register(user: Pick<UserInsertSchema, "email" | "password">) {
    return this.db.insert(userTable).values(user).returning()
  }

  async createRefreshToken(userId: TokenInsertSchema["userId"]) {
    return await this.db
      .insert(tokenTable)
      .values({ token: v4(), expires: add(new Date(), { months: 1 }), userId })
      .returning()
  }

  async getRefreshToken(refreshToken: TokenSelectSchema["token"]) {
    return await this.db.query.tokenTable.findFirst({
      where: (fields, { eq }) => eq(fields.token, refreshToken),
    })
  }

  async deleteRefreshToken(refreshToken: TokenSelectSchema["token"]) {
    return await this.db
      .delete(tokenTable)
      .where(eq(tokenTable.token, refreshToken))
  }
}
