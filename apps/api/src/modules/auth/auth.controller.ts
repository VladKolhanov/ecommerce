import { Body, Controller, Post } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { LoginDto, RegisterDto } from "./dto/auth.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const tokens = await this.authService.login(dto)

    return { accessToken: tokens.accessToken }
  }

  // @Get("refresh")
  // refreshToken() {}
}
