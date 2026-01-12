import { Injectable } from "@nestjs/common"
import { AuthenticationDto } from "../../dto/authentication.dto"
import { AuthenticateService } from "./authenticate.service"
import { FindOrCreateRefreshTokenStateService } from "./findOrCreateRefreshTokenState.service"
import { BuildAccessTokenService } from "../tokens/buildAccessToken.service"
import { BuildRefreshTokenService } from "../tokens/buildRefreshToken.service"
import { BuildCsrfTokenService } from "../csrf/buildCsrfToken.service"
import { LoginInternalResult } from "../../types/loginInternalResult"

@Injectable()
export class LoginService {
  constructor(
    private readonly authenticateService: AuthenticateService,
    private readonly findOrCreateRefreshTokenStateService: FindOrCreateRefreshTokenStateService,
    private readonly buildAccessTokenService: BuildAccessTokenService,
    private readonly buildRefreshTokenService: BuildRefreshTokenService,
    private readonly buildCsrfTokenService: BuildCsrfTokenService,
  ) {}

  public async execute(
    credentials: AuthenticationDto,
    userAgent: string,
  ): Promise<LoginInternalResult> {
    const user = await this.authenticateService.execute(credentials)
    const refreshTokenState = await this.findOrCreateRefreshTokenStateService.execute(
      user.id,
      userAgent,
    )
    return {
      accessToken: await this.buildAccessTokenService.execute(user),
      refreshToken: await this.buildRefreshTokenService.execute(refreshTokenState),
      csrfToken: this.buildCsrfTokenService.execute(refreshTokenState.id),
    }
  }
}
