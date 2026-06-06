import { DB, UserInsert, userTable } from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"

import { InjectDb } from "../../../core/db/db.provider"

@Injectable()
export class AuthRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async register(user: Pick<UserInsert, "email" | "password">) {
    return await this.db.insert(userTable).values(user).returning({
      id: userTable.id,
      email: userTable.email,
      role: userTable.role,
    })
  }
}
