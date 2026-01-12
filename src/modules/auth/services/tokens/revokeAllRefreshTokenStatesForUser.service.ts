import { Injectable } from "@nestjs/common"
import { RefreshTokenState } from "../../entities"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class RevokeAllRefreshTokenStatesForUserService {
  constructor(
    @InjectRepository(RefreshTokenState)
    private readonly refreshTokenRepository: Repository<RefreshTokenState>,
  ) {}

  public async execute(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, revoked: false },
      {
        revoked: true,
        updatedAt: new Date(),
      },
    )
  }
}
