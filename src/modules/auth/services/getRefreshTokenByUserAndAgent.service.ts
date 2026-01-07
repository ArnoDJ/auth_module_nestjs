import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { RefreshToken } from "../entities/refreshTokenState"
import { Repository } from "typeorm"

@Injectable()
export class GetRefreshTokenStateByUserAndAgentService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  public async execute(userId: string, userAgent: string): Promise<RefreshToken> {
    const refreshTokenState = await this.getRefreshTokenStateByIdAndUserAgent(userId)
    if (!refreshTokenState) {
      throw new UnauthorizedException("not allowed")
    }
    return refreshTokenState
  }

  private async getRefreshTokenStateByIdAndUserAgent(
    userId: string
  ): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: { userId }
    })
  }
}
