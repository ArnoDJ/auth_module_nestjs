import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { SessionState } from "../../entities/sessionState"
import { Repository } from "typeorm"

@Injectable()
export class GetSessionStateByIdService {
  constructor(
    @InjectRepository(SessionState)
    private readonly sessionStateRepository: Repository<SessionState>
  ) {}

  public async execute(id: string): Promise<SessionState> {
    const sessionState = await this.getSessionStateById(id)
    if (!sessionState) {
      throw new UnauthorizedException("not allowed")
    }
    return sessionState
  }

  private async getSessionStateById(
    id: string
  ): Promise<SessionState | null> {
    return await this.sessionStateRepository.findOne({
      where: { id }
    })
  }
}
