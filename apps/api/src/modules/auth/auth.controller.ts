import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common"
import { type Response } from "express"

import { Tokens } from "./auth.interfaces"
import { AuthService } from "./auth.service"
import { LoginDto, RegisterDto } from "./dto/auth.dto"
import { EnvService } from "../../core/env/env.service"
import { Cookie } from "../../shared/decorators/cookies.decorator"

const REFRESH_TOKEN = "refreshToken"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly envServie: EnvService
  ) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto)

    this.setRefreshTokenToCookies(tokens, res)

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken })
  }

  @Post("refresh")
  async refreshToken(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    const tokens = await this.authService.refreshTokens(refreshToken)

    this.setRefreshTokenToCookies(tokens, res)

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken })
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(tokens.refreshToken.expires),
      secure: !this.envServie.isDev,
      path: "/",
    })
  }
}
