import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { UserDto } from "../../dto/user.dto"
import { AccessTokenPayload } from "../../types/tokenPayload"

@Injectable()
export class BuildAccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(user: UserDto): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      admin: user.admin,
    }

    const expiresInSeconds = this.getExpiresInSeconds()

    return await this.jwtService.signAsync(payload, {
      expiresIn: `${expiresInSeconds}s`,
    })
  }

  private getExpiresInSeconds(): number {
    const rawValue = this.configService.get<string>(
      "JWT_ACCESS_TOKEN_EXPIRE_TIME",
    )
    const value =
      rawValue === undefined || rawValue === ""
        ? undefined
        : Number(rawValue)
    if (value === undefined) {
      return 60 * 15
    }

    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("JWT_ACCESS_TOKEN_EXPIRE_TIME must be a positive integer")
    }

    return value
  }
}
