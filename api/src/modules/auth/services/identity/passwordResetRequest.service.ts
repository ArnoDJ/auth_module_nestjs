import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { randomUUID } from "crypto"
import { Repository } from "typeorm"
import { PasswordResetToken } from "../../entities/passwordResetToken.entity"
import { User } from "../../entities/user.entity"
import { ConfigService } from "@nestjs/config"
import { EmailService } from "../email.service"
import { GetUserByEmailService } from "../users/getUserByEmail.service"
import { passwordResetEmailTemplate } from "../../emailTemplates/passwordReset.template"

@Injectable()
export class PasswordResetRequestService {
  private static readonly TTL_MINUTES = 10

  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly getUserByEmailService: GetUserByEmailService,
  ) {}

  public async execute(email: string): Promise<void> {
    const user = await this.getUserByEmailService.execute(email)
    await this.passwordResetTokenRepository.delete({ userId: user.id })

    const token = randomUUID()
    await this.savePasswordResetToken(user.id, token)

    const frontendBaseUrl = this.configService.get<string>("FRONTEND_BASE_URL")
    const resetUrl = `${frontendBaseUrl}/password-reset/${token}`

    await this.sendEmailWithToken(user, resetUrl)
  }

  private async savePasswordResetToken(
    userId: string,
    token: string
  ): Promise<void> {
    const validUntil = new Date(
      Date.now() + PasswordResetRequestService.TTL_MINUTES * 60_000,
    )
    await this.passwordResetTokenRepository.save({
      userId,
      token,
      validUntil
    })
  }

  private async sendEmailWithToken(
    user: User,
    resetUrl: string,
  ): Promise<void> {
    const { subject, html, text } = passwordResetEmailTemplate(user, resetUrl)

    await this.emailService.send(
      user.email,
      `${user.firstName} ${user.lastName}`,
      subject,
      html,
      text,
    )
  }
}
