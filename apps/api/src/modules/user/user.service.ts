import { ConflictException, Injectable } from "@nestjs/common"
import argon2 from "argon2"

import {
  CreateUserDto,
  DeleteUserDto,
  FindOneUserByEmailDto,
  FindOneUserByIdDto,
} from "./dto/user.dto"
import { UserRepository } from "./user.repository"

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async save(user: CreateUserDto) {
    const isUserExist = !!(await this.findByEmail({
      email: user.email,
    }))

    if (isUserExist) {
      throw new ConflictException("User already exist")
    }

    const hashedPassword = await this.hashPassword(user.password)

    return this.userRepository.create({ ...user, password: hashedPassword })
  }

  async findById({ id }: FindOneUserByIdDto) {
    return this.userRepository.findOneById(id)
  }

  async findByEmail({ email }: FindOneUserByEmailDto) {
    return this.userRepository.findOneByEmail(email)
  }

  async delete({ id }: DeleteUserDto) {
    return this.userRepository.deleteOne(id)
  }

  private hashPassword(password: string) {
    return argon2.hash(password)
  }
}
