import { BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { EmailVerificationToken, User } from "../../entities"

export class VerifyEmailService {
  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async execute(token: string): Promise<void> {
    const emailVerificationToken = await this.findEmailVerificationToken(token)
    const user = await this.getUserFromTokenData(emailVerificationToken.userId)
    await this.userRepository.update({ id: emailVerificationToken.userId },
      {
        emailVerifiedAt: new Date()
      }
    ) as unknown as User
    await this.deleteEmailVerificationToken(user.id)
  }

  private async findEmailVerificationToken(token: string): Promise<EmailVerificationToken> {
    const emailVerificationToken = await this.emailVerificationTokenRepository.findOne({ where: { token }})
    if(!emailVerificationToken) {
      throw new BadRequestException("invalid link")
    }

    if(emailVerificationToken.validUntil > new Date()) {
      return emailVerificationToken
    }
    throw new BadRequestException("link has expired")
  }

  private async getUserFromTokenData(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId }})
    if(!user) {
      throw new NotFoundException("user with id from token does not exist")
    }
    return user
  }

  private async deleteEmailVerificationToken(userId: string): Promise<void> {
    await this.emailVerificationTokenRepository.delete({ userId })
  }
}
