import { Injectable, BadRequestException } from "@nestjs/common"
import { hash } from "bcrypt"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../../entities/user.entity"
import { Repository } from "typeorm"
import { CreateUserDto, UserDto } from "../../dto/user.dto"
import { randomUUID } from "crypto"
import { EmailVerificationToken } from "../../entities"
import { ConfigService } from "@nestjs/config"
import { EmailService } from "../email.service"
import { emailVerificationTemplate } from "../../emailTemplates/emailVerification.template"

@Injectable()
export class RegisterUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerificationToken) private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  public async execute(userData: CreateUserDto): Promise<void> {
    this.checkIfpasswordsMatch(userData)
    if (await this.alreadyExists(userData)) {
      throw new BadRequestException("An account already exists for this email address")
    }
    const user =  await this.createUser(userData)
    const emailVerificationToken = await this.saveVerificationToken(user.id)
    await this.sendEmailWithToken(user, emailVerificationToken.token)
  }

  private async createUser(userData: CreateUserDto): Promise<User> {
    return await this.userRepository.save(
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: await this.hashPassword(userData.password)
      }
    )
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10)
  }

  private async alreadyExists(userData: CreateUserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: userData.email }
    })
    if (!user) {
      return false
    }
    return true
  }

  private checkIfpasswordsMatch(createUserData: CreateUserDto): void {
    if(createUserData.password !== createUserData.passwordConfirmation) {
      throw new BadRequestException("passwords don't match")
    }
  }

  private async saveVerificationToken(
    userId: string,
  ): Promise<EmailVerificationToken> {
    const token = randomUUID()
    const validUntil = new Date(Date.now() + 24 * 60 * 60_000)

    return await this.emailVerificationTokenRepository.save({
      userId,
      token,
      validUntil,
    })
  }

  private async sendEmailWithToken(
    user: UserDto,
    token: string,
  ): Promise<void> {
    const frontendBaseUrl =
      this.configService.get<string>("FRONTEND_BASE_URL")!

    const verifyUrl = `${frontendBaseUrl}/verify-email/${token}`

    const { subject, html, text } =
      emailVerificationTemplate(user, verifyUrl)

    await this.emailService.send(
      user.email,
      `${user.firstName} ${user.lastName}`,
      subject,
      html,
      text,
    )
  }
}
