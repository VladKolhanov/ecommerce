import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

import { AuthController } from "./auth.controller"
import { AuthRepository } from "./auth.repository"
import { AuthService } from "./auth.service"
import { GUARDS } from "./guards"
import { STRATEGIES } from "./strategies"
import { options } from "../../core/configs/jwt-module-async-options"
import { UserModule } from "../user/user.module"

@Module({
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, ...STRATEGIES, ...GUARDS],
})
export class AuthModule {}
