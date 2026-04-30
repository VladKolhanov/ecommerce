import {
  DB,
  UserResponseSchema,
  UserSelectSchema,
  userTable,
} from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { eq } from "drizzle-orm"

import { InjectDb } from "../../core/db/db.provider"

@Injectable()
export class UserRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async findOneById(
    id: UserSelectSchema["id"]
  ): Promise<UserResponseSchema | undefined> {
    return await this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.id, id),
      columns: { id: true, email: true, role: true },
    })
  }

  async findOneByEmail(
    email: UserSelectSchema["email"]
  ): Promise<UserResponseSchema | undefined> {
    return await this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
      columns: { id: true, email: true, role: true },
    })
  }

  async findOneByEmailWithPassword(
    email: UserSelectSchema["email"]
  ): Promise<
    (UserResponseSchema & Pick<UserSelectSchema, "password">) | undefined
  > {
    return await this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
      columns: { id: true, email: true, role: true, password: true },
    })
  }

  async deleteOne(id: UserSelectSchema["id"]): Promise<UserResponseSchema[]> {
    return await this.db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning({
        id: userTable.id,
        email: userTable.email,
        role: userTable.role,
      })
  }
}
