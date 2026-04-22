import { eq } from "drizzle-orm"

import { dbClient } from "../client"
import { userTable } from "../schemas/auth"
import type { CreateUser, UserSelectSchema } from "../validation/user"

export function create(user: CreateUser) {
  return dbClient.insert(userTable).values(user)
}

export function findById(id: UserSelectSchema["id"]) {
  return dbClient.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  })
}

export function findByEmail(email: UserSelectSchema["email"]) {
  return dbClient.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  })
}

export function deleteOne(id: UserSelectSchema["id"]) {
  return dbClient.delete(userTable).where(eq(userTable.id, id))
}
