import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../../../modules/auth/entities/user"
import { UsersInfoDto } from "../../dto/user.dto"

@Injectable()
export class GetAllUsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async execute(): Promise<UsersInfoDto[]> {
    return await this.userRepository.createQueryBuilder("user")
      .select("user.id", "id")
      .addSelect("user.first_name", "firstName")
      .addSelect("user.last_name", "lastName")
      .addSelect("user.email", "email")
      .addSelect("user.admin", "admin")
      .addSelect("count(bird)::integer", "birdCount")
      .addSelect("file.url", "profilePicture")
      .leftJoin("birds", "bird", "bird.user_id = user.id AND bird.deceased = false")
      .leftJoin("files", "file", "file.subject_id::uuid = user.id")
      .groupBy("user.id")
      .addGroupBy("file.url")
      .orderBy("user.first_name")
      .getRawMany()
  }
}
