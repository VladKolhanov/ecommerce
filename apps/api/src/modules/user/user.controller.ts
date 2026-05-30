import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common"
import { ZodSerializerDto } from "nestjs-zod"

import {
  DeleteUserDto,
  FindOneUserByEmailDto,
  FindOneUserByIdDto,
  UserResponseDto,
} from "./dto/user.dto"
import { UserService } from "./user.service"
import { JwtPayload } from "../../core/interfaces"
import { CurrentUser } from "../../shared/decorators/current-user.decorator"
import { Roles } from "../../shared/decorators/roles.decorator"
import { RolesGuard } from "../auth/guards/role.guard"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ZodSerializerDto(UserResponseDto)
  @Get("id/:id")
  async findOneUserById(@Param() dto: FindOneUserByIdDto) {
    return this.userService.findById(dto)
  }

  @ZodSerializerDto(UserResponseDto)
  @Get("email/:email")
  async findOneUserByEmail(@Param() dto: FindOneUserByEmailDto) {
    return this.userService.findByEmail(dto)
  }

  @ZodSerializerDto(UserResponseDto)
  @Delete(":id")
  async deleteUser(
    @Param() dto: DeleteUserDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.userService.delete(dto, user)
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Get("me")
  me(@CurrentUser() user: JwtPayload) {
    return user
  }
}
