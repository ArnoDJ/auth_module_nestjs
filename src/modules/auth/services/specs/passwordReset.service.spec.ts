import { bootstrapTestingModule } from "./helper"
import { hash } from "bcrypt"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { getRepositoryToken } from "@nestjs/typeorm"
import { PasswordResetToken } from "../../entities/passwordResetToken"
import { PasswordResetService } from "../passwordReset.service"

describe("PasswordResetService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let passwordResetTokenRepository: Repository<PasswordResetToken>
  let passwordResetService: PasswordResetService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    passwordResetTokenRepository = module.get<Repository<PasswordResetToken>>(getRepositoryToken(PasswordResetToken))
    passwordResetService = module.get<PasswordResetService>(PasswordResetService)
  })

  it("should be defined", () => {
    expect(passwordResetService).toBeDefined()
  })

  it("should successfully create a passwordResetToken", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "arno@pau.be",
      password: await hash("test", 10)
    })

    await passwordResetService.execute(
      user.email
    )
    const removedToken = await passwordResetTokenRepository.findOne({ where: { userId: user.id }})
    expect(removedToken).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
