import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { RefreshTokenState } from "../entities/refreshTokenState"

@Injectable()
export class RevokeRefreshTokenStateService {
  constructor(
    @InjectRepository(RefreshTokenState)
    private readonly refreshTokenRepository: Repository<RefreshTokenState>,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { id },
      {
        revoked: true,
        updatedAt: new Date(),
      },
    )
  }
}
