import { bootstrapTestingModule } from "./helper"
import { hash } from "bcrypt"
import { AuthenticateService } from "../authentication/authenticate.service"
import { UnauthorizedException } from "@nestjs/common"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("AuthenticateService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let authenticateService: AuthenticateService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    authenticateService = module.get<AuthenticateService>(AuthenticateService)
  })

  it("should be defined", () => {
    expect(authenticateService).toBeDefined()
  })

  it("should successfully authenticate the user", async () => {
    await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: await hash("test", 10)
    })

    const result = await authenticateService.execute({
      email: "test@test.com",
      password: "test"
    })
    expect(result).toBeDefined()
  })

  it("should fail authenticating the user because password is wrong", async () => {
    await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: await hash("test", 10)
    })
    await expect(
      authenticateService.execute({
        email: "test@test.com",
        password: "wrong"
      })
    ).rejects.toThrowError(UnauthorizedException)
  })

  it("should fail authenticating the user because user with that email is not found", async () => {
    await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: await hash("test", 10)
    })
    await expect(
      authenticateService.execute({
        email: "notfound@test.com",
        password: "test"
      })
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
