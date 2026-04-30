import { UserResponseSchema } from "@ecommerce/data-access"
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import argon2 from "argon2"

import { AuthRepository } from "./auth.repository"
import { LoginDto, RegisterDto } from "./dto/auth.dto"
import { HTTP_ERROR_MESSAGES } from "../../core/exceptions/messages.constant"
import { JwtPayload, Tokens } from "../../core/interfaces"
import { UserService } from "../user/user.service"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository
  ) {}

  async register(userInput: RegisterDto) {
    const isUserExist = !!(await this.userService.findByEmail({
      email: userInput.email,
    }))

    if (isUserExist)
      throw new ConflictException(HTTP_ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS)

    const hashedPassword = await this.hashPassword(userInput.password)

    const [createdUser] = await this.authRepository.register({
      ...userInput,
      password: hashedPassword,
    })

    return createdUser
  }

  async login(userInput: LoginDto, agent: string): Promise<Tokens> {
    const user = await this.userService.findByEmailWithPassword({
      email: userInput.email,
    })

    if (!user)
      throw new UnauthorizedException(
        HTTP_ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS
      )

    const isPasswordsVerified = await this.verifyPassword(
      user.password,
      userInput.password
    )

    if (!isPasswordsVerified)
      throw new UnauthorizedException(
        HTTP_ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS
      )

    return this.generateTokens(user, agent)
  }

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.authRepository.getRefreshToken(refreshToken)

    if (!token) throw new UnauthorizedException()

    if (new Date(token.expires) < new Date()) {
      await this.authRepository.deleteRefreshToken(refreshToken)
      throw new UnauthorizedException()
    }

    await this.authRepository.deleteRefreshToken(refreshToken)

    const user = await this.userService.findById({ id: token.userId })

    if (!user) throw new UnauthorizedException()

    return this.generateTokens(user, agent)
  }

  private hashPassword(password: string) {
    return argon2.hash(password)
  }

  private async verifyPassword(digest: string, password: string) {
    return await argon2.verify(digest, password)
  }

  private async signJwt(payload: Parameters<typeof this.jwtService.sign>[0]) {
    return this.jwtService.signAsync(payload)
  }

  private async generateTokens(user: UserResponseSchema, agent: string) {
    const accessTokenPayload = {
      sub: user.id,
      role: user.role,
    } satisfies JwtPayload

    const accessToken = await this.signJwt(accessTokenPayload)
    const [refreshToken] = await this.authRepository.createRefreshToken(
      user.id,
      agent
    )

    return { accessToken: `Bearer ${accessToken}`, refreshToken }
  }
}
