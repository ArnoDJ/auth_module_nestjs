import { BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { hash } from "bcrypt"
import { ChangePasswordDto } from "../dto/changePassword.dto"
import { Repository } from "typeorm"
import { PasswordResetToken } from "../entities/passwordResetToken"
import { User } from "../entities/user"

export class AlterPasswordService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async execute(changePasswordData: ChangePasswordDto, token: string): Promise<void> {
    this.checkIfpaswordsMatch(changePasswordData)
    const passwordResetToken = await this.getPasswordResetToken(token)
    const user = await this.getUserFromTokenData(passwordResetToken.userId)
    const newPassword = await this.hashPassword(changePasswordData.password)
    await this.userRepository.update({ id: user.id },
      {
        ...user,
        password: newPassword
      }
    ) as unknown as User
    await this.passwordResetTokenRepository.delete({ userId: user.id })
  }

  private checkIfpaswordsMatch(changePaswordData: ChangePasswordDto): void {
    if(changePaswordData.password !== changePaswordData.passwordConfirmation) {
      throw new BadRequestException("passwords don't match")
    }
  }

  private async getPasswordResetToken(token: string): Promise<PasswordResetToken> {
    const passwordResetToken = await this.passwordResetTokenRepository.findOne({ where: { token }})
    if(!passwordResetToken) {
      throw new BadRequestException("link has expired")
    }

    if(passwordResetToken.validUntil > new Date()) {
      return passwordResetToken
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

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10)
  }
}
