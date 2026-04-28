import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Logger } from "nestjs-pino"
import { ExtractJwt, Strategy } from "passport-jwt"

import { EnvService } from "../../../core/env/env.service"
import { UserService } from "../../user/user.service"
import { JwtPayload } from "../auth.interfaces"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly envService: EnvService,
    private readonly userService: UserService,
    private readonly logger: Logger
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtSecret,
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById({ id: payload.sub })

    if (!user) throw new UnauthorizedException()

    return payload
  }
}
