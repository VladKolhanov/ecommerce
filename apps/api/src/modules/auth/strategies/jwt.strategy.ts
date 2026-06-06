import { tryCatch } from "@ecommerce/utils"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

import { EnvService } from "../../../core/env/env.service"
import { JwtAuthPayload } from "../../../shared/types"
import { UserService } from "../../user/user.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly envService: EnvService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtSecret,
    })
  }

  async validate(payload: JwtAuthPayload) {
    const [user] = await tryCatch(this.userService.findById(payload.sub))

    if (!user) throw new UnauthorizedException()

    return payload
  }
}
