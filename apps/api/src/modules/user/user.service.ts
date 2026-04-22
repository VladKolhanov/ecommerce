import { dalUser } from "@ecommerce/data-access"
import { Injectable } from "@nestjs/common"
import argon2 from "argon2"

@Injectable()
export class UserService {
  async save(user: Parameters<typeof dalUser.create>[0]) {
    const hashedPassword = await this.hashPassword(user.password)
    return dalUser.create({ ...user, password: hashedPassword })
  }

  findById(id: Parameters<typeof dalUser.findById>[0]) {
    return dalUser.findById(id)
  }

  findByEmail(email: Parameters<typeof dalUser.findByEmail>[0]) {
    return dalUser.findByEmail(email)
  }

  delete(id: Parameters<typeof dalUser.deleteOne>[0]) {
    return dalUser.deleteOne(id)
  }

  private hashPassword(password: string) {
    return argon2.hash(password)
  }
}
