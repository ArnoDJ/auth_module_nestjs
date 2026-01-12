import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { RefreshTokenState } from "../entities/refreshTokenState"
import { Repository } from "typeorm"

@Injectable()
export class GetRefreshTokenStateByUserAndAgentService {
  constructor(
    @InjectRepository(RefreshTokenState)
    private readonly refreshTokenRepository: Repository<RefreshTokenState>
  ) {}

  public async execute(userId: string, userAgent: string): Promise<RefreshTokenState> {
    const refreshTokenState = await this.getRefreshTokenStateByIdAndUserAgent(userId)
    if (!refreshTokenState) {
      throw new UnauthorizedException("not allowed")
    }
    return refreshTokenState
  }

  private async getRefreshTokenStateByIdAndUserAgent(
    userId: string
  ): Promise<RefreshTokenState | null> {
    return await this.refreshTokenRepository.findOne({
      where: { userId }
    })
  }
}
