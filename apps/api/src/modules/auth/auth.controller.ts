import {
  LoginInputDto,
  type LoginResponse,
  LoginResponseDto,
  type LogoutResponse,
  LogoutResponseDto,
  type RefreshTokenInsert,
  type RefreshTokenResponse,
  RefreshTokenResponseDto,
  RegisterInputDto,
  type RegisterResponse,
  RegisterResponseDto,
  type TwoFactorSetupResponse,
  TwoFactorSetupResponseDto,
  TwoFactorVerifyInputDto,
  type TwoFactorVerifyResponse,
  TwoFactorVerifyResponseDto,
} from "@ecommerce/data-access"
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common"
import { type Request, type Response } from "express"
import { ZodSerializerDto } from "nestjs-zod"

import { TwoFactorPayload } from "./decorators/jwt-two-factor-payload.decorator"
import { Protected } from "./decorators/protected.decorator"
import { TwoFactorGuard } from "./guards/two-factor.guard"
import { AuthService } from "./services/auth.service"
import { TokensService } from "./services/tokens.service"
import { TwoFactorService } from "./services/two-factor.service"
import { EnvService } from "../../core/env/env.service"
import { AppSource } from "../../shared/decorators/app-source.decorator"
import { UserAgent } from "../../shared/decorators/user-agent.decorator"
import type { AppSourceType, JwtTwoFactorPayload } from "../../shared/types"

@Controller("auth")
export class AuthController {
  refreshTokenKey = this.envService.refreshTokenCookieKey

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokensService,
    private readonly twoFactorService: TwoFactorService,
    private readonly envService: EnvService
  ) {}

  @ZodSerializerDto(RegisterResponseDto)
  @Post("register")
  async register(
    @Body() dto: RegisterInputDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() agent: string
  ): Promise<RegisterResponse> {
    const tokens = await this.authService.register(dto, agent)

    this.setRefreshTokenToCookies(tokens.refreshToken, res)

    return { accessToken: tokens.accessToken }
  }

  @ZodSerializerDto(LoginResponseDto)
  @Post("login")
  async login(
    @Body() dto: LoginInputDto,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() agent: string,
    @AppSource() source: AppSourceType
  ): Promise<LoginResponse> {
    const tokens = await this.authService.login(dto, agent, source)

    if (source === "shop" && "accessToken" in tokens) {
      this.setRefreshTokenToCookies(tokens.refreshToken, res)
      return { accessToken: tokens.accessToken, success: true }
    } else {
      return { success: true }
    }
  }

  @ZodSerializerDto(LogoutResponseDto)
  @Post("logout")
  @Protected()
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LogoutResponse> {
    const refreshToken = req.cookies[
      this.envService.refreshTokenCookieKey
    ] as string

    if (!refreshToken) {
      return { success: true }
    }

    await this.tokenService.deleteRefreshToken(refreshToken)

    this.deleteRefreshTokenFromCookies(res)

    return { success: true }
  }

  @ZodSerializerDto(RefreshTokenResponseDto)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() agent: string
  ): Promise<RefreshTokenResponse> {
    const refreshToken = req.cookies[
      this.envService.refreshTokenCookieKey
    ] as string

    if (!refreshToken) throw new UnauthorizedException()

    const tokens = await this.tokenService.refreshTokens(refreshToken, agent)

    this.setRefreshTokenToCookies(tokens.refreshToken, res)

    return { accessToken: tokens.accessToken }
  }

  @ZodSerializerDto(TwoFactorSetupResponseDto)
  @Get("two-factor")
  @UseGuards(TwoFactorGuard)
  async twoFactorSetup(
    @TwoFactorPayload() tfaPayload: JwtTwoFactorPayload
  ): Promise<TwoFactorSetupResponse> {
    return await this.authService.getTwoFactorSetupData(tfaPayload)
  }

  @ZodSerializerDto(TwoFactorVerifyResponseDto)
  @Post("two-factor")
  @UseGuards(TwoFactorGuard)
  async twoFactorVerify(
    @Res({ passthrough: true }) res: Response,
    @TwoFactorPayload() tfaPayload: JwtTwoFactorPayload,
    @Body() dto: TwoFactorVerifyInputDto,
    @UserAgent() agent: string
  ): Promise<TwoFactorVerifyResponse> {
    await this.twoFactorService.verifyTOTPCode(tfaPayload.sub, dto.code)

    const tokens = await this.tokenService.generateAuthTokens(
      { sub: tfaPayload.sub, role: tfaPayload.role },
      agent
    )

    this.setRefreshTokenToCookies(tokens.refreshToken, res)

    return { accessToken: tokens.accessToken }
  }

  private setRefreshTokenToCookies(
    refreshToken: RefreshTokenInsert,
    res: Response
  ) {
    res.cookie(this.envService.refreshTokenCookieKey, refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(refreshToken.expires),
      secure: !this.envService.isDev,
      path: "/",
    })
  }

  private deleteRefreshTokenFromCookies(res: Response) {
    res.cookie(this.envService.refreshTokenCookieKey, "", {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(0),
      secure: !this.envService.isDev,
      path: "/",
    })
  }
}
