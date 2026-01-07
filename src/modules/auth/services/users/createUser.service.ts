import { Injectable, BadRequestException } from "@nestjs/common"
import { hash } from "bcrypt"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../../../../modules/auth/entities/user"
import { Repository } from "typeorm"
import { CreateUserDto, UserDto } from "../../dto/user.dto"

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async execute(userData: CreateUserDto): Promise<UserDto> {
    if (await this.alreadyExists(userData)) {
      throw new BadRequestException(
        `user with email: ${userData.email} already exists `
      )
    }
    return await this.createUser(userData)
  }

  private async createUser(userData: CreateUserDto): Promise<UserDto> {
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
}
