import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"

import { UserRepository } from "./user.repository"
import { ErrorMessages } from "../../core/exceptions"
import { JwtAuthPayload } from "../../shared/types"

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById<T extends boolean = false>(
    id: string,
    options?: { isSensitive?: T }
  ) {
    const user = await this.userRepository.findOneById(id, options?.isSensitive)

    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

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

    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

    return user
  }

  async delete(id: string, jwtPayload: JwtAuthPayload) {
    if (jwtPayload.sub !== id && jwtPayload.role !== "admin") {
      throw new ForbiddenException()
    }

    const isDeleted = await this.userRepository.deleteOne(id)

    if (!isDeleted) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)
    }
  }
}
