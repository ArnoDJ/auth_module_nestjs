import { Injectable } from "@nestjs/common"
import { AuthenticationDto } from "../../dto/authentication.dto"
import { AuthenticateService } from "../credentials/authenticate.service"
import { FindOrCreateSessionStateService } from "./findOrCreateSessionState.service"
import { BuildAccessTokenService } from "../tokens/buildAccessToken.service"
import { BuildRefreshTokenService } from "../tokens/buildRefreshToken.service"
import { BuildCsrfTokenService } from "../csrf/buildCsrfToken.service"
import { LoginInternalResult } from "../../types/loginInternalResult"

@Injectable()
export class LoginService {
  constructor(
    private readonly authenticateService: AuthenticateService,
    private readonly findOrCreateSessionStateService: FindOrCreateSessionStateService,
    private readonly buildAccessTokenService: BuildAccessTokenService,
    private readonly buildRefreshTokenService: BuildRefreshTokenService,
    private readonly buildCsrfTokenService: BuildCsrfTokenService,
  ) {}

  public async execute(
    credentials: AuthenticationDto,
    userAgent: string,
  ): Promise<LoginInternalResult> {
    const user = await this.authenticateService.execute(credentials)
    const refreshTokenState = await this.findOrCreateSessionStateService.execute(
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
