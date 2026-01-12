import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { RefreshTokenState } from "../entities/refreshTokenState"
import { Repository } from "typeorm"

@Injectable()
export class GetRefreshTokenStateByIdService {
  constructor(
    @InjectRepository(RefreshTokenState)
    private readonly refreshTokenRepository: Repository<RefreshTokenState>
  ) {}

  public async execute(id: string): Promise<RefreshTokenState> {
    const refreshTokenState = await this.getRefreshTokenStateByIdAndUserAgent(id)
    if (!refreshTokenState) {
      throw new UnauthorizedException("not allowed")
    }
    return refreshTokenState
  }

  private async getRefreshTokenStateByIdAndUserAgent(
    id: string
  ): Promise<RefreshTokenState | null> {
    return await this.refreshTokenRepository.findOne({
      where: { id }
    })
  }
}
