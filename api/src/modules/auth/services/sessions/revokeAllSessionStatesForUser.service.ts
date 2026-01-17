import { Injectable } from "@nestjs/common"
import { SessionState } from "../../entities"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class RevokeAllSessionStatesForUserService {
  constructor(
    @InjectRepository(SessionState)
    private readonly sessionStateRepository: Repository<SessionState>,
  ) {}

  public async execute(userId: string): Promise<void> {
    await this.sessionStateRepository.update(
      { userId, revoked: false },
      {
        revoked: true,
        updatedAt: new Date(),
      },
    )
  }
}
