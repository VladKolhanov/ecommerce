import {
  DB,
  RefreshTokenInsert,
  RefreshTokenSelect,
  tokenTable,
} from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { add } from "date-fns"
import { eq } from "drizzle-orm"
import { v4 } from "uuid"

import { InjectDb } from "../../../core/db/db.provider"
import { EnvService } from "../../../core/env/env.service"

@Injectable()
export class TokensRepository {
  constructor(
    @InjectDb() private readonly db: DB,
    private readonly envService: EnvService
  ) {}

  async createRefreshToken(
    userId: RefreshTokenInsert["userId"],
    agent: RefreshTokenInsert["userAgent"]
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

  async getRefreshToken(refreshToken: RefreshTokenSelect["token"]) {
    return await this.db.query.tokenTable.findFirst({
      where: (token, { eq }) => eq(token.token, refreshToken),
    })
  }

  async deleteRefreshToken(refreshToken: RefreshTokenInsert["token"]) {
    await this.db.delete(tokenTable).where(eq(tokenTable.token, refreshToken))
  }

  private generateRefreshToken(
    userId: RefreshTokenInsert["userId"],
    agent: RefreshTokenInsert["userAgent"]
  ): RefreshTokenInsert {
    return {
      token: v4(),
      expires: add(new Date(), { days: this.envService.refreshTokenExpire }),
      userId,
      userAgent: agent,
    }
  }
}
