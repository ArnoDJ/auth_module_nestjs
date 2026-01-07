import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { RefreshTokenState } from "../../entities/refreshTokenState"
import { GetUserByIdService } from "../users/getUserById.service"

@Injectable()
export class FindOrCreateRefreshTokenStateService {
  constructor(
    private readonly getUserByIdService: GetUserByIdService,
    @InjectRepository(RefreshTokenState)
    private readonly refreshTokenRepository: Repository<RefreshTokenState>,
  ) {}

  public async execute(
    userId: string,
    userAgent: string,
  ): Promise<RefreshTokenState> {
    await this.getUserByIdService.execute(userId)

    const existingToken = await this.refreshTokenRepository.findOne({
      where: { userId, userAgent },
    })
    if (!existingToken || existingToken.revoked) {
      return await this.createRefreshToken(userId, userAgent)
    }

    return existingToken
  }

  private async createRefreshToken(
    userId: string,
    userAgent: string,
  ): Promise<RefreshTokenState> {
    const token = this.refreshTokenRepository.create({
      userId,
      userAgent,
      revoked: false,
    })

    return await this.refreshTokenRepository.save(token)
  }
}
