import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { randomUUID } from "crypto"
import { Repository } from "typeorm"
import { PasswordResetToken } from "../entities/passwordResetToken"
import { User } from "../entities/user"
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend"

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken) private readonly passwordResetTokenRepository: Repository<PasswordResetToken>
  ) {}

  public async execute(email: string): Promise<void> {
    const token = randomUUID()
    const now = new Date()
    const endTime = new Date(now.getTime() + 360000)
    const user = await this.getUserByEmail(email)
    await this.createPasswordResetToken(user, token, endTime)
    return await this.sendEmailWithToken(user)
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email }})
    if(!user) {
      throw new NotFoundException(`user with email ${email} not found`)
    }
    return user
  }

  private async createPasswordResetToken(user: User, token: string, endTime: Date): Promise<void> {
    await this.passwordResetTokenRepository.save({
      userId: user.id,
      token,
      validUntil: endTime
    })
  }

  private async sendEmailWithToken(user: User): Promise<void> {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILER_SEND_API_KEY!,
    })

    const sentFrom = new Sender("MS_NqmUyX@trial-351ndgwxoyr4zqx8.mlsender.net", "Birzoo")

    const recipients = [
      new Recipient(user.email, `${user.firstName} ${user.lastName}`)
    ]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Password reset token")
      .setHtml("<strong><a href='localhost:3000/password_reset/'> Click here to reset your password</a></strong>")
      .setText("This is the text content")

    await mailerSend.email.send(emailParams)
  }
}
