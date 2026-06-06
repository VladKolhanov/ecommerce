import { tryCatch } from "@ecommerce/utils"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { EnvService } from "../../../core/env/env.service"
import type { JwtAuthPayload, JwtTwoFactorPayload } from "../../../shared/types"
import { UserService } from "../../user/user.service"
import { TokensRepository } from "../repositories/tokens.repository"

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly envService: EnvService,
    private readonly tokensRepository: TokensRepository
  ) {}

  async generateAuthTokens(
    payload: Omit<JwtAuthPayload, "type">,
    agent: string
  ) {
    const accessTokenPayload = {
      sub: payload.sub,
      role: payload.role,
      type: "AUTH",
    } satisfies JwtAuthPayload

    const accessToken = await this.jwtService.signAsync(accessTokenPayload)
    const [refreshToken] = await this.tokensRepository.createRefreshToken(
      payload.sub,
      agent
    )

    return { accessToken, refreshToken }
  }

  async generateTwoFactorToken(payload: Omit<JwtTwoFactorPayload, "type">) {
    const twoFactorTokenPayload = {
      sub: payload.sub,
      role: payload.role,
      type: "TWO_FACTOR",
    } satisfies JwtTwoFactorPayload

    const token = await this.jwtService.signAsync(twoFactorTokenPayload, {
      secret: this.envService.jwtTwoFactorSecret,
      expiresIn: "5m",
    })

    return token
  }

  async refreshTokens(refreshToken: string, agent: string) {
    const token = await this.tokensRepository.getRefreshToken(refreshToken)

    if (!token) throw new UnauthorizedException()

    const isExpired = new Date(token.expires) < new Date()

    await this.tokensRepository.deleteRefreshToken(refreshToken)

    if (isExpired) throw new UnauthorizedException("Token expired")

    const [user] = await tryCatch(this.userService.findById(token.userId))

    if (!user) throw new UnauthorizedException()

    return this.generateAuthTokens({ role: user.role, sub: user.id }, agent)
  }

  async deleteRefreshToken(token: string) {
    return await this.tokensRepository.deleteRefreshToken(token)
  }
}
