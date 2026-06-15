import { ForbiddenException, Injectable } from "@nestjs/common"

import { UserRepository } from "./user.repository"
import { UserNotFoundException } from "../../core/exceptions/domain.exception"
import { JwtAuthPayload } from "../../shared/types"

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById<T extends boolean = false>(
    id: string,
    options?: { isSensitive?: T }
  ) {
    const user = await this.userRepository.findOneById(id, options?.isSensitive)

    if (!user) throw new UserNotFoundException()

    return user
  }

  async findByEmail<T extends boolean = false>(
    email: string,
    options?: { isSensitive?: T }
  ) {
    const user = await this.userRepository.findOneByEmail(
      email,
      options?.isSensitive
    )

    if (!user) throw new UserNotFoundException()

    return user
  }

  async delete(id: string, jwtPayload: JwtAuthPayload) {
    if (jwtPayload.sub !== id && jwtPayload.role !== "admin")
      throw new ForbiddenException()

    const isDeleted = await this.userRepository.deleteOne(id)

    if (!isDeleted) throw new UserNotFoundException()
  }
}
