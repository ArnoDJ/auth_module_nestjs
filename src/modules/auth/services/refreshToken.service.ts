import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { BuildAccessTokenService } from "./tokens/buildAccessToken.service"
import { BuildRefreshTokenService } from "./tokens/buildRefreshToken.service"
import { BuildCsrfTokenService } from "./csrf/buildCsrfToken.service"
import { GetUserByIdService } from "./users/getUserById.service"
import { GetRefreshTokenStateByIdService } from "./getRefreshTokenStateById.service"
import { RevokeRefreshTokenStateService } from "./revokeRefreshTokenState.service"
import { FindOrCreateRefreshTokenStateService } from "./authentication/findOrCreateRefreshTokenState.service"
import { LoginInternalResult } from "../types/loginInternalResult"
import { RefreshTokenJwtPayload } from "../types/tokenPayload"

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly getRefreshTokenStateByIdService: GetRefreshTokenStateByIdService,
    private readonly revokeRefreshTokenStateService: RevokeRefreshTokenStateService,
    private readonly findOrCreateRefreshTokenStateService: FindOrCreateRefreshTokenStateService,
    private readonly getUserByIdService: GetUserByIdService,
    private readonly buildAccessTokenService: BuildAccessTokenService,
    private readonly buildRefreshTokenService: BuildRefreshTokenService,
    private readonly buildCsrfTokenService: BuildCsrfTokenService,
  ) {}

  public async execute(
    refreshTokenJwt: string,
    userAgent: string,
  ): Promise<LoginInternalResult> {
    const { sid, sub } = await this.verifyToken(refreshTokenJwt)

    const oldState =
      await this.getRefreshTokenStateByIdService.execute(sid)
    if (oldState.revoked) {
      throw new UnauthorizedException("not allowed")
    }

    if (oldState.userAgent !== userAgent) {
      throw new UnauthorizedException("not allowed")
    }

    await this.revokeRefreshTokenStateService.execute(oldState.id)

    const newState =
      await this.findOrCreateRefreshTokenStateService.execute(
        sub,
        userAgent,
      )

    const user = await this.getUserByIdService.execute(sub)

    return {
      accessToken: await this.buildAccessTokenService.execute(user),
      refreshToken: await this.buildRefreshTokenService.execute({
        id: newState.id,
        userId: newState.userId,
      }),
      csrfToken: this.buildCsrfTokenService.execute(newState.id),
    }
  }


  private async verifyToken(
    refreshToken: string,
  ): Promise<{ sub: string; sid: string }> {
    try {
      const payload: unknown =
        await this.jwtService.verifyAsync(refreshToken)
      if (
        !payload ||
        typeof payload !== "object" ||
        typeof (payload as RefreshTokenJwtPayload).sub !== "string" ||
        typeof (payload as RefreshTokenJwtPayload).sid !== "string"
      ) {
        throw new UnauthorizedException("not allowed")
      }

      const { sub, sid } = payload as RefreshTokenJwtPayload
      return { sub, sid }
    } catch {
      throw new UnauthorizedException("not allowed")
    }
  }
}
