import { Injectable } from "@nestjs/common"

import {
  DeleteUserDto,
  FindOneUserByEmailDto,
  FindOneUserByIdDto,
} from "./dto/user.dto"
import { UserRepository } from "./user.repository"

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById({ id }: FindOneUserByIdDto) {
    return await this.userRepository.findOneById(id)
  }

  async findByEmail({ email }: FindOneUserByEmailDto) {
    return await this.userRepository.findOneByEmail(email)
  }

  async findByEmailWithPassword({ email }: FindOneUserByEmailDto) {
    return await this.userRepository.findOneByEmailWithPassword(email)
  }

  async delete({ id }: DeleteUserDto) {
    const [deletedUser] = await this.userRepository.deleteOne(id)

    return deletedUser
  }
}
