import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../../entities/user.entity"
import { Repository } from "typeorm"
import { UserDto } from "../../dto/user.dto"

@Injectable()
export class GetUserByIdService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new NotFoundException(`user with id: ${id} does not exist`)
    }
    return user
  }
}
