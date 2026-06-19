import {
  DeleteParamsDto,
  type DeleteResponse,
  DeleteResponseDto,
  FindFirstByEmailQueryDto,
  type FindFirstByEmailResponse,
  FindFirstByEmailResponseDto,
  FindFirstByIdParamsDto,
  type FindFirstByIdResponse,
  FindFirstByIdResponseDto,
} from "@ecommerce/data-access"
import { Controller, Delete, Get, Param, Query } from "@nestjs/common"
import { ZodSerializerDto } from "nestjs-zod"

import { UserService } from "./user.service"
import { Roles } from "../../shared/constants"
import { type JwtAuthPayload as JwtPayloadType } from "../../shared/types"
import { JwtPayload } from "../auth/decorators/jwt-payload.decorator"
import { Protected } from "../auth/decorators/protected.decorator"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ZodSerializerDto(FindFirstByIdResponseDto)
  @Get(":id")
  @Protected(Roles.ADMIN)
  async findFirstById(
    @Param() { id }: FindFirstByIdParamsDto
  ): Promise<FindFirstByIdResponse> {
    return await this.userService.findById(id)
  }

  @ZodSerializerDto(FindFirstByEmailResponseDto)
  @Get()
  @Protected(Roles.ADMIN)
  async findFirstByEmail(
    @Query() dto: FindFirstByEmailQueryDto
  ): Promise<FindFirstByEmailResponse> {
    return await this.userService.findByEmail(dto.email)
  }

  @ZodSerializerDto(DeleteResponseDto)
  @Delete(":id")
  @Protected()
  async delete(
    @Param() { id }: DeleteParamsDto,
    @JwtPayload() jwtPayload: JwtPayloadType
  ): Promise<DeleteResponse> {
    await this.userService.delete(id, jwtPayload)

    return { success: true }
  }
}
