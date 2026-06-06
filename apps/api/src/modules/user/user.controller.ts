import {
  type DeleteResponse,
  DeleteResponseDto,
  FindFirstByEmailInputDto,
  type FindFirstByEmailResponse,
  FindFirstByEmailResponseDto,
  type FindFirstByIdResponse,
  FindFirstByIdResponseDto,
} from "@ecommerce/data-access"
import { Body, Controller, Delete, Get, Param } from "@nestjs/common"
import { ZodSerializerDto } from "nestjs-zod"

import { UserService } from "./user.service"
import { Roles } from "../../shared/constants"
import { type JwtAuthPayload as JwtPayloadType } from "../../shared/types"
import { JwtPayload } from "../auth/decorators/jwt-payload.decorator"
import { Protected } from "../auth/decorators/protected.decorator"

@Controller("user")
@Protected()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ZodSerializerDto(FindFirstByIdResponseDto)
  @Get("id")
  @Protected(Roles.ADMIN)
  async findFirstById(@Param() id: string): Promise<FindFirstByIdResponse> {
    return await this.userService.findById(id)
  }

  @ZodSerializerDto(FindFirstByEmailResponseDto)
  @Get("email")
  @Protected(Roles.ADMIN)
  async findFirstByEmail(
    @Body() dto: FindFirstByEmailInputDto
  ): Promise<FindFirstByEmailResponse> {
    return await this.userService.findByEmail(dto.email)
  }

  @ZodSerializerDto(DeleteResponseDto)
  @Delete(":id")
  @Protected()
  async delete(
    @Param() id: string,
    @JwtPayload() jwtPayload: JwtPayloadType
  ): Promise<DeleteResponse> {
    await this.userService.delete(id, jwtPayload)

    return { success: true }
  }
}
