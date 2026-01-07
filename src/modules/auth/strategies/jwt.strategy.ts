import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GetUserByIdService } from "../services/users/getUserById.service"
import { TokenPayload } from "../types/tokenPayload"
import { UserDto } from "../dto/user.dto"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService
  ) {
    const jwtSecret = configService.get<string>("JWT_SECRET")
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret
    })
  }

  async validate(payload: TokenPayload): Promise<UserDto> {
    return await this.getUserByIdService.execute(payload.sub)
  }
}
