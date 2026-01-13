import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SessionState } from "../../entities/sessionState"
import { GetUserByIdService } from "../users/getUserById.service"

@Injectable()
export class FindOrCreateSessionStateService {
  constructor(
    private readonly getUserByIdService: GetUserByIdService,
    @InjectRepository(SessionState)
    private readonly sessionStateRepository: Repository<SessionState>,
  ) {}

  public async execute(
    userId: string,
    userAgent: string,
  ): Promise<SessionState> {
    await this.getUserByIdService.execute(userId)

    const existingToken = await this.sessionStateRepository.findOne({
      where: { userId, userAgent },
    })
    if (!existingToken || existingToken.revoked) {
      return await this.createSessionState(userId, userAgent)
    }

    return existingToken
  }

  private async createSessionState(
    userId: string,
    userAgent: string,
  ): Promise<SessionState> {
    const token = this.sessionStateRepository.create({
      userId,
      userAgent,
      revoked: false,
    })

    return await this.sessionStateRepository.save(token)
  }
}
