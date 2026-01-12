import { Injectable } from "@nestjs/common"
import { GetRefreshTokenStateByUserAndAgentService } from "./getRefreshTokenByUserAndAgent.service"
import { RevokeRefreshTokenStateService } from "./revokeRefreshTokenState.service"

@Injectable()
export class LogoutService {
  constructor(
    private readonly getRefreshTokenStateByUserAndAgentService: GetRefreshTokenStateByUserAndAgentService,
    private readonly revokeRefreshTokenStateService: RevokeRefreshTokenStateService,
  ) {}

  public async execute(userId: string, userAgent: string): Promise<void> {
    const refreshTokenState =
      await this.getRefreshTokenStateByUserAndAgentService.execute(
        userId,
        userAgent,
      )

    await this.revokeRefreshTokenStateService.execute(
      refreshTokenState.id,
    )
  }
}
