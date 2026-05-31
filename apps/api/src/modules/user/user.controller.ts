import { Controller, Delete, Get, Param } from "@nestjs/common"
import { ZodSerializerDto } from "nestjs-zod"

import {
  DeleteUserDto,
  FindOneUserByEmailDto,
  FindOneUserByIdDto,
  UserResponseDto,
} from "./dto/user.dto"
import { UserService } from "./user.service"
import { JwtPayload } from "../../shared/decorators/jwt-payload.decorator"
import { type JwtPayload as JwtPayloadType } from "../../shared/interfaces"
import { Protected } from "../auth/decorators/protected.decorator"

@Controller("user")
@Protected()
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
    @JwtPayload() jwtPayload: JwtPayloadType
  ) {
    return this.userService.delete(dto, jwtPayload)
  }
}
