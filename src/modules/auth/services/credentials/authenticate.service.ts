/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { compare } from "bcrypt"
import { AuthenticationDto } from "../../dto/authentication.dto"
import { UserDto } from "../../dto/user.dto"
import { AccountLockoutService } from "./accountLockout.service"
import { User } from "../../entities"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { LoginAttemptResultEnum } from "../../enums/loginAttempResult.enum"

const DUMMY_PASSWORD_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8vGZ4l5Q8R1R7ZJ1J1Z1Z1Z1Z1Z1Z"

@Injectable()
export class AuthenticateService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly accountLockoutService: AccountLockoutService,
  ) {}

  public async execute(data: AuthenticationDto): Promise<UserDto> {
    const user = await this.findUserSafely(data.email)
    const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH
    const passwordMatches = await compare(data.password, passwordHash)
    if (!user || !passwordMatches) {
      if (user) {
          await this.accountLockoutService.execute(user, LoginAttemptResultEnum.FAILURE)
      }
      throw new UnauthorizedException("not allowed")
    }
    await this.accountLockoutService.execute(user, LoginAttemptResultEnum.SUCCESS)
    return this.mapToUserDto(user)
  }

  private async findUserSafely(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email }
    })
  }

  private mapToUserDto(user: User): UserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      admin: user.admin,
    }
  }
}
