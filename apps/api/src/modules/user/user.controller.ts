import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common"

import {
  CreateUserDto,
  DeleteUserDto,
  FindOneUserByEmailDto,
  FindOneUserByIdDto,
} from "./dto/user.dto"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.save(dto)
  }

  @Get("id/:id")
  async findOneUserById(@Param() dto: FindOneUserByIdDto) {
    return this.userService.findById(dto.id)
  }

  @Get("email/:email")
  async findOneUserByEmail(@Param() dto: FindOneUserByEmailDto) {
    return this.userService.findByEmail(dto.email)
  }

  @Delete(":id")
  async deleteUser(@Param() dto: DeleteUserDto) {
    return this.userService.delete(dto.id)
  }
}
