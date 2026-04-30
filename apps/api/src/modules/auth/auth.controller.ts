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
import { ZodSerializerDto } from "nestjs-zod"

import { AuthService } from "./auth.service"
import { LoginDto, RegisterDto, RegisterResponseDto } from "./dto/auth.dto"
import { EnvService } from "../../core/env/env.service"
import { Tokens } from "../../core/interfaces"
import { Public } from "../../shared/decorators/public.decorator"
import { UserAgent } from "../../shared/decorators/user-agent.decorator"

@Public()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly envServie: EnvService
  ) {}

  refreshTokenKey = this.envServie.refreshTokenCookieKey

  @ZodSerializerDto(RegisterResponseDto)
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: string
  ) {
    const tokens = await this.authService.login(dto, agent)

    this.setRefreshTokenToCookies(tokens, res)

    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken })
  }

  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @UserAgent() agent: string
  ) {
    const refreshToken = req.cookies[this.envServie.refreshTokenCookieKey]

    if (!refreshToken) throw new UnauthorizedException()

    const tokens = await this.authService.refreshTokens(refreshToken, agent)

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
