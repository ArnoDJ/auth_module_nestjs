import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { randomUUID } from "crypto"
import { Repository } from "typeorm"
import { PasswordResetToken } from "../entities/passwordResetToken"
import { User } from "../entities/user"
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class PasswordResetService {
  private static readonly TTL_MINUTES = 10

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly configService: ConfigService,
  ) {}

  public async execute(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      return
    }

    // Optional hardening: invalidate previous tokens
    await this.passwordResetTokenRepository.delete({ userId: user.id })

    const token = randomUUID()
    const validUntil = new Date(
      Date.now() + PasswordResetService.TTL_MINUTES * 60_000,
    )

    await this.passwordResetTokenRepository.save({
      userId: user.id,
      token,
      validUntil,
    })

    await this.sendEmailWithToken(user, token)
  }

  private async sendEmailWithToken(
    user: User,
    token: string,
  ): Promise<void> {
    const apiKey =
      this.configService.get<string>("MAILER_SEND_API_KEY")
    const senderEmail =
      this.configService.get<string>("MAILER_SENDER_EMAIL")
    const senderName =
      this.configService.get<string>("MAILER_SENDER_NAME")
    const frontendBaseUrl =
      this.configService.get<string>("FRONTEND_BASE_URL")
    if (!apiKey || !senderEmail || !frontendBaseUrl) {
      throw new Error("Password reset mail configuration is incomplete")
    }

    const mailerSend = new MailerSend({ apiKey })

    const sentFrom = new Sender(
      senderEmail,
      senderName ?? "Support",
    )

    const recipients = [
      new Recipient(user.email, `${user.firstName} ${user.lastName}`),
    ]

    const resetUrl = `${frontendBaseUrl}/password-reset/${token}`

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Reset your password")
      .setHtml(`
        <strong>
          <a href="${resetUrl}">
            Click here to reset your password
          </a>
        </strong>
      `)
      .setText(`Reset your password: ${resetUrl}`)

    await mailerSend.email.send(emailParams)
  }
}
