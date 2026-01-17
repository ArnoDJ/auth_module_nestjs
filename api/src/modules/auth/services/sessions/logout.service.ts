import { Injectable } from "@nestjs/common"
import { GetSessionStateByAgentService } from "./getSessionStateByAgent.service"
import { RevokeSessionStateService } from "./revokeSessionState.service"

@Injectable()
export class LogoutService {
  constructor(
    private readonly getSessionStateByUserAndAgentService: GetSessionStateByAgentService,
    private readonly revokeSessionStateService: RevokeSessionStateService,
  ) {}

  public async execute(userId: string, userAgent: string): Promise<void> {
    const sessionState =
      await this.getSessionStateByUserAndAgentService.execute(
        userId,
        userAgent,
      )

    await this.revokeSessionStateService.execute(
      sessionState.id,
    )
  }
}
