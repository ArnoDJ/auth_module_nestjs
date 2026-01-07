import { bootstrapTestingModule } from "./helper"
import { BuildCookieWithRefreshTokenService } from "../cookies/buildCookieWithRefreshToken.service"
import { BuildRefreshTokenService } from "../tokens/buildRefreshToken.service"
import { DatabaseService } from "../../../../modules/database/database.service"
import { User } from "../../entities/user"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { RefreshToken } from "../../entities/refreshTokenState"

describe("BuildCookieWithRefreshTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenRepository: Repository<RefreshToken>
  let buildCookieWithRefreshTokenService: BuildCookieWithRefreshTokenService
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
    buildCookieWithRefreshTokenService = module.get<
      BuildCookieWithRefreshTokenService
    >(BuildCookieWithRefreshTokenService)
  })

  it("should be defined", () => {
    expect(buildCookieWithRefreshTokenService).toBeDefined()
  })

  it("should successfully build a cookie with a refresh token", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })

    const refreshTokenState = await refreshTokenRepository.save({
      userId: user.id,
      userAgent: "test",
      revoked: false
    })

    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )

    const result = buildCookieWithRefreshTokenService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
