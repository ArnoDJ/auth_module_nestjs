import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend"

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  private getMailer(): MailerSend {
    const apiKey = this.configService.get<string>("MAILER_SEND_API_KEY")
    if (!apiKey) {
      throw new Error("MAILER_SEND_API_KEY is not configured")
    }
    return new MailerSend({ apiKey })
  }

  private getSender(): Sender {
    const email = this.configService.get<string>("MAILER_SENDER_EMAIL")
    const name = this.configService.get<string>("MAILER_SENDER_NAME") ?? "Support"
    if (!email) {
      throw new Error("MAILER_SENDER_EMAIL is not configured")
    }

    return new Sender(email, name)
  }

  public async send(
    toEmail: string,
    toName: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    const mailer = this.getMailer()
    const sender = this.getSender()

    const recipients = [new Recipient(toEmail, toName)]

    const params = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setReplyTo(sender)
      .setSubject(subject)
      .setHtml(html)
    if (text) {
      params.setText(text)
    }

    await mailer.email.send(params)
  }
}
