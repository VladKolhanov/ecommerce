import type { LoginInput, RegisterInput } from "@ecommerce/data-access"
import { tryCatch } from "@ecommerce/utils"
import { Injectable } from "@nestjs/common"
import argon2 from "argon2"

import { TokensService } from "./tokens.service"
import { TwoFactorService } from "./two-factor.service"
import {
  AuthAccessDeniedException,
  AuthInvalidCredentialsException,
} from "../../../core/exceptions/domain.exception"
import { AppSourceType, JwtTwoFactorPayload } from "../../../shared/types"
import { UserService } from "../../user/user.service"
import { AuthRepository } from "../repositories/auth.repository"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
    private readonly twoFactorService: TwoFactorService,
    private readonly authRepository: AuthRepository
  ) {}

  async register(userInput: RegisterInput, agent: string) {
    const [user] = await tryCatch(this.userService.findByEmail(userInput.email))

    if (user) throw new AuthInvalidCredentialsException()

    const hashedPassword = await this.hashPassword(userInput.password)

    const [createdUser] = await this.authRepository.register({
      ...userInput,
      password: hashedPassword,
    })

    return await this.tokensService.generateAuthTokens(
      { sub: createdUser.id, role: createdUser.role },
      agent
    )
  }

  async login(userInput: LoginInput, agent: string, source: AppSourceType) {
    const [user] = await tryCatch(
      this.userService.findByEmail(userInput.email, {
        isSensitive: true,
      })
    )

    if (!user) throw new AuthInvalidCredentialsException()

    const isPasswordsVerified = await this.verifyPassword(
      user.password,
      userInput.password
    )

    if (!isPasswordsVerified) throw new AuthInvalidCredentialsException()

    if (source === "shop") {
      return await this.tokensService.generateAuthTokens(
        { sub: user.id, role: user.role },
        agent
      )
    } else {
      if (user.role !== "admin") throw new AuthAccessDeniedException()

      const token = await this.tokensService.generateTwoFactorToken({
        sub: user.id,
        role: user.role,
      })

      return {
        twoFactorToken: token,
      }
    }
  }

  async getTwoFactorSetupData(jwtPayload: JwtTwoFactorPayload) {
    const [user] = await tryCatch(
      this.userService.findById(jwtPayload.sub, {
        isSensitive: true,
      })
    )

    if (!user) throw new AuthInvalidCredentialsException()

    if (!user.isTwoFactorEnabled) {
      const qrcodeUri = await this.twoFactorService.generateQrcode(user.id)

      return {
        isTwoFactorEnabled: false,
        qrcode: qrcodeUri,
      }
    }

    return {
      isTwoFactorEnabled: true,
    }
  }

  private hashPassword(password: string) {
    return argon2.hash(password)
  }

  private async verifyPassword(digest: string, password: string) {
    return await argon2.verify(digest, password)
  }
}
