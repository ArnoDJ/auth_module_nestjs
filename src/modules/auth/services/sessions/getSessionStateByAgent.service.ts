import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { SessionState } from "../../entities/sessionState"
import { Repository } from "typeorm"

@Injectable()
export class GetSessionStateByAgentService {
  constructor(
    @InjectRepository(SessionState)
    private readonly sessionStateRepository: Repository<SessionState>
  ) {}

  public async execute(userId: string, userAgent: string): Promise<SessionState> {
    const sessionState = await this.getSessionStateByUserIdAndAgent(userId, userAgent)
    if (!sessionState) {
      throw new UnauthorizedException("not allowed")
    }
    return sessionState
  }

  private async getSessionStateByUserIdAndAgent(
    userId: string,
    userAgent: string
  ): Promise<SessionState | null> {
    return await this.sessionStateRepository.findOne({
      where: { userId, userAgent }
    })
  }
}
