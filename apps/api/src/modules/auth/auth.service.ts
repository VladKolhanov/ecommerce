import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import argon2 from "argon2"

import { Tokens } from "./auth.interfaces"
import { AuthRepository } from "./auth.repository"
import { LoginDto, RegisterDto } from "./dto/auth.dto"
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

    if (isUserExist) {
      throw new ConflictException("Invalid credentials")
    }

    const hashedPassword = await this.hashPassword(userInput.password)

    const [createdUser] = await this.authRepository.register({
      ...userInput,
      password: hashedPassword,
    })

    return createdUser
  }

  async login(userInput: LoginDto): Promise<Tokens> {
    const user = await this.userService.findByEmail({
      email: userInput.email,
    })

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordsVerified = await argon2.verify(
      user.password,
      userInput.password
    )

    if (!isPasswordsVerified) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    })

    const [refreshToken] = await this.authRepository.getRefreshToken(user.id)

    return { accessToken, refreshToken }
  }

  private hashPassword(password: string) {
    return argon2.hash(password)
  }
}
