import { bootstrapTestingModule } from "./helper"
import { BuildRefreshTokenService } from "../tokens/buildRefreshToken.service"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { getRepositoryToken } from "@nestjs/typeorm"
import { RefreshToken } from "../../entities/refreshTokenState"

describe("BuildRefreshTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenRepository: Repository<RefreshToken>
  let buildRefreshTokenService: BuildRefreshTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User)
    )
    refreshTokenRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken)
    )
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )
  })

  it("should be defined", () => {
    expect(buildRefreshTokenService).toBeDefined()
  })

  it("should successfully build a refresh token", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const refreshToken = await refreshTokenRepository.save({
        userId: user.id,
        revoked: false,
        userAgent: "test"
    })

    const result = await buildRefreshTokenService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
