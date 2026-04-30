import {
  DB,
  TokenInsertSchema,
  TokenSelectSchema,
  tokenTable,
  UserInsertSchema,
  UserResponseSchema,
  userTable,
} from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { add } from "date-fns"
import { eq } from "drizzle-orm"
import { v4 } from "uuid"

import { InjectDb } from "../../core/db/db.provider"
import { EnvService } from "../../core/env/env.service"

@Injectable()
export class AuthRepository {
  constructor(
    @InjectDb() private readonly db: DB,
    private readonly envService: EnvService
  ) {}

  async register(
    user: Pick<UserInsertSchema, "email" | "password">
  ): Promise<UserResponseSchema[]> {
    return await this.db.insert(userTable).values(user).returning({
      id: userTable.id,
      email: userTable.email,
      role: userTable.role,
    })
  }

  async createRefreshToken(
    userId: TokenInsertSchema["userId"],
    agent: TokenInsertSchema["userAgent"]
  ) {
    const token = this.generateRefreshToken(userId, agent)

    return await this.db
      .insert(tokenTable)
      .values(token)
      .onConflictDoUpdate({
        target: [tokenTable.userId, tokenTable.userAgent],
        set: {
          token: token.token,
          expires: token.expires,
        },
      })
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

  private generateRefreshToken(
    userId: TokenInsertSchema["userId"],
    agent: TokenInsertSchema["userAgent"]
  ): TokenInsertSchema {
    return {
      token: v4(),
      expires: add(new Date(), { days: this.envService.refreshTokenExpire }),
      userId,
      userAgent: agent,
    }
  }
}
