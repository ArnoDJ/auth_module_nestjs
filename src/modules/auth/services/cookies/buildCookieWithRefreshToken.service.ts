import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class BuildCookieWithRefreshTokenService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {}

  public execute(refreshToken: string): string {
    const cookieExpireTime = this.configService.get<string>(
      "COOKIE_EXPIRE_TIME"
    )
    return `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/auth/refresh_token; SameSite=None; Max-Age=${
      cookieExpireTime ?? 3800
    }`
  }
}
