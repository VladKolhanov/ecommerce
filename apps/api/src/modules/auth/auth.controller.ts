import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common"
import { type Request, type Response } from "express"

import { Tokens } from "./auth.interfaces"
import { AuthService } from "./auth.service"
import { LoginDto, RegisterDto } from "./dto/auth.dto"
import { EnvService } from "../../core/env/env.service"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly envServie: EnvService
  ) {}

  refreshTokenKey = this.envServie.refreshTokenCookieKey

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
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies[this.envServie.refreshTokenCookieKey]

    if (!refreshToken) throw new UnauthorizedException()

    const tokens = await this.authService.refreshTokens(refreshToken)

    this.setRefreshTokenToCookies(tokens, res)

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken })
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    res.cookie(
      this.envServie.refreshTokenCookieKey,
      tokens.refreshToken.token,
      {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(tokens.refreshToken.expires),
        secure: !this.envServie.isDev,
        path: "/",
      }
    )
  }
}
