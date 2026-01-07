import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { RefreshToken } from "../../entities/refreshTokenState"
import { RefreshTokenJwtPayload } from "../../types/tokenPayload"

@Injectable()
export class BuildRefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(refreshToken: RefreshToken): Promise<string> {
    const expiresInSeconds =
      this.configService.get<number>("JWT_REFRESH_TOKEN_EXPIRE_TIME") ??
      60 * 60 * 24 * 7 // 7 days

    const payload: RefreshTokenJwtPayload = {
      sub: refreshToken.userId,
      sid: refreshToken.id,
    }

    return await this.jwtService.signAsync(payload, {
      expiresIn: `${expiresInSeconds}s`,
    })
  }
}
