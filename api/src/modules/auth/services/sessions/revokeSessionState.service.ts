import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SessionState } from "../../entities"

@Injectable()
export class RevokeSessionStateService {
  constructor(
    @InjectRepository(SessionState)
    private readonly sessionStateRepository: Repository<SessionState>,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.sessionStateRepository.update(
      { id },
      {
        revoked: true,
        updatedAt: new Date(),
      },
    )
  }
}
