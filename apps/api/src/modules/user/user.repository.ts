import {
  DB,
  UserInsertSchema,
  UserSelectSchema,
  userTable,
} from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { eq } from "drizzle-orm"

import { InjectDb } from "../../core/db/db.provider"

@Injectable()
export class UserRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async create(user: Pick<UserInsertSchema, "email" | "password">) {
    return this.db.insert(userTable).values(user).returning()
  }

  async findOneById(id: UserSelectSchema["id"]) {
    return this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    })
  }

  async findOneByEmail(email: UserSelectSchema["email"]) {
    return this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    })
  }

  async deleteOne(id: UserSelectSchema["id"]) {
    return this.db.delete(userTable).where(eq(userTable.id, id)).returning()
  }
}
