import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

import { AuthController } from "./auth.controller"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { RolesGuard } from "./guards/roles.guard"
import { AuthRepository } from "./repositories/auth.repository"
import { TokensRepository } from "./repositories/tokens.repository"
import { TwoFactorRepository } from "./repositories/two-factor.repository"
import { AuthService } from "./services/auth.service"
import { TokensService } from "./services/tokens.service"
import { TwoFactorService } from "./services/two-factor.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { options } from "../../core/configs/jwt-module-async-options"
import { EncryptionModule } from "../../shared/services/encryption/encryption.module"
import { UserModule } from "../user/user.module"

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UserModule,
    EncryptionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwoFactorService,
    TokensService,
    AuthRepository,
    TwoFactorRepository,
    TokensRepository,
    JwtAuthGuard,
    RolesGuard,
    JwtStrategy,
  ],
})
export class AuthModule {}
