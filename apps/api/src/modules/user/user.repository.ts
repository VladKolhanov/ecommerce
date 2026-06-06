/* eslint-disable @typescript-eslint/no-explicit-any */
import { DB, UserSelect, userTable } from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import { eq } from "drizzle-orm"

import { InjectDb } from "../../core/db/db.provider"

type UserResponse = Pick<UserSelect, "id" | "email" | "role">
type UserResponseSensitive = UserResponse &
  Pick<UserSelect, "password" | "isTwoFactorEnabled" | "twoFactorSecretKey">

@Injectable()
export class UserRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async findOneById<T extends boolean = false>(
    id: UserSelect["id"],
    isSensitive?: T
  ): Promise<(T extends true ? UserResponseSensitive : UserResponse) | null> {
    const result = await this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.id, id),
      columns: {
        id: true,
        email: true,
        role: true,
        password: !!isSensitive,
        isTwoFactorEnabled: !!isSensitive,
        twoFactorSecretKey: !!isSensitive,
      },
    })

    if (!result) return null

    return result as any
  }

  async findOneByEmail<T extends boolean = false>(
    email: UserSelect["email"],
    isSensitive?: T
  ): Promise<(T extends true ? UserResponseSensitive : UserResponse) | null> {
    const result = await this.db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
      columns: {
        id: true,
        email: true,
        role: true,
        password: !!isSensitive,
        isTwoFactorEnabled: !!isSensitive,
        twoFactorSecretKey: !!isSensitive,
      },
    })

    if (!result) return null

    return result as any
  }

  async deleteOne(id: UserSelect["id"]) {
    const result = await this.db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning()

    return result.length > 0
  }
}
