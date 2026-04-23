import {
  DB,
  TokenInsertSchema,
  tokenTable,
  UserInsertSchema,
  userTable,
} from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { add } from "date-fns"
import { v4 } from "uuid"

import { InjectDb } from "../../core/db/db.provider"

@Injectable()
export class AuthRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async register(user: Pick<UserInsertSchema, "email" | "password">) {
    return this.db.insert(userTable).values(user).returning()
  }

  async getRefreshToken(userId: TokenInsertSchema["userId"]) {
    return await this.db
      .insert(tokenTable)
      .values({ token: v4(), expires: add(new Date(), { months: 1 }), userId })
      .returning()
  }
}
