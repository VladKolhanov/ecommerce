import { Injectable } from "@nestjs/common"
import argon2 from "argon2"

import { UserRepository } from "./user.repository"

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async save(user: Parameters<typeof this.userRepository.create>[0]) {
    const hashedPassword = await this.hashPassword(user.password)
    return this.userRepository.create({ ...user, password: hashedPassword })
  }

  async findById(id: Parameters<typeof this.userRepository.findById>[0]) {
    return this.userRepository.findById(id)
  }

  async findByEmail(
    email: Parameters<typeof this.userRepository.findByEmail>[0]
  ) {
    return this.userRepository.findByEmail(email)
  }

  async delete(id: Parameters<typeof this.userRepository.deleteOne>[0]) {
    return this.userRepository.deleteOne(id)
  }

  private hashPassword(password: string) {
    return argon2.hash(password)
  }
}
