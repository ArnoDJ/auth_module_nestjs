import { bootstrapTestingModule } from "./helper"
import { LogoutService } from "../logout.service"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { RefreshToken } from "../../entities/refreshTokenState"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("LogoutService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenRepository: Repository<RefreshToken>
  let logoutService: LogoutService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User)
    )
    refreshTokenRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken)
    )
    logoutService = module.get<LogoutService>(LogoutService)
  })

  it("should be defined", () => {
    expect(logoutService).toBeDefined()
  })

  it("should logs out of the application", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const refreshTokenState = await refreshTokenRepository.save({
      userId: user.id,
      revoked: false,
      userAgent: "test"
    })
    await logoutService.execute(user.id, refreshTokenState.userAgent)

    const refreshToken = await refreshTokenRepository.find({ where: { userId: user.id}})
    expect(refreshToken[0].revoked).toBeTruthy()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
