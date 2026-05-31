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
import { Protected } from "./decorators/protected.decorator"
import { LoginDto, RegisterDto, RegisterResponseDto } from "./dto/auth.dto"
import { EnvService } from "../../core/env/env.service"
import { UserAgent } from "../../shared/decorators/user-agent.decorator"
import { Tokens } from "../../shared/interfaces"

@Controller("auth")
export class AuthController {
  refreshTokenKey = this.envServie.refreshTokenCookieKey

  constructor(
    private readonly authService: AuthService,
    private readonly envServie: EnvService
  ) {}

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

  @Post("logout")
  @Protected()
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies[
      this.envServie.refreshTokenCookieKey
    ] as string

    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK)
      return
    }

    await this.authService.deleteRefreshToken(refreshToken)

    res.cookie(this.envServie.refreshTokenCookieKey, "", {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    })

    res.sendStatus(HttpStatus.OK)
  }

  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @UserAgent() agent: string
  ) {
    const refreshToken = req.cookies[
      this.envServie.refreshTokenCookieKey
    ] as string

    if (!refreshToken) throw new UnauthorizedException()

    const tokens = await this.authService.getTokensPair(refreshToken, agent)

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
