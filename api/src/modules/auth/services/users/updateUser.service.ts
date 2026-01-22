import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../../entities/user.entity"
import { Repository } from "typeorm"
import { UpdateUserDto, UserDto } from "../../dto/user.dto"

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async execute(id: string, userData: UpdateUserDto): Promise<UserDto> {
    await this.checkIfUserExists(id)
    try {
      return await this.userRepository.update({ id },
        {
          ...userData,
          updatedAt: new Date().toISOString()
        }
      ) as unknown as UserDto
    } catch (error) {
      throw new BadRequestException(`user with id: ${id} not found`)
    }
  }

  private async checkIfUserExists(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id }})
    if(!user) {
      throw new NotFoundException(`user with id ${id} not found`)
    }
  }
}
