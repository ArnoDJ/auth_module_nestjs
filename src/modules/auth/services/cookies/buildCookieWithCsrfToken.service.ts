import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class BuildCookieWithCsrfTokenService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  public execute(csrfToken: string): string {
    const maxAge =
      this.configService.get<number>("CSRF_TOKEN_TTL") ??
      60 * 60 * 24

    return [
      `_csrf=${csrfToken}`,
      "Path=/",
      "Secure",
      "SameSite=None",
      `Max-Age=${maxAge}`,
    ].join("; ")
  }
}
