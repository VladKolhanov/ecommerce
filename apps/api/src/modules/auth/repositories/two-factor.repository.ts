import { DB, UserSelect, userTable } from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { eq } from "drizzle-orm"

import { InjectDb } from "../../../core/db/db.provider"

@Injectable()
export class TwoFactorRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async saveTwoFactorSecret(
    id: UserSelect["id"],
    secret: NonNullable<UserSelect["twoFactorSecretKey"]>
  ) {
    await this.db
      .update(userTable)
      .set({ twoFactorSecretKey: secret })
      .where(eq(userTable.id, id))
  }

  async getTwoFactorState(id: UserSelect["id"]) {
    return await this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.id, id),
      columns: {
        isTwoFactorEnabled: true,
        twoFactorSecretKey: true,
      },
    })
  }

  async updateTwoFactorState(id: UserSelect["id"]) {
    await this.db
      .update(userTable)
      .set({ isTwoFactorEnabled: true })
      .where(eq(userTable.id, id))
  }
}
