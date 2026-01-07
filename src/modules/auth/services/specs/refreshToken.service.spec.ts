import { bootstrapTestingModule } from "./helper"
import { RefreshTokenService } from "../refreshToken.service"
import { BuildRefreshTokenService } from "../tokens/buildRefreshToken.service"
import { JwtService } from "@nestjs/jwt"
import { UnauthorizedException } from "@nestjs/common"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { RefreshToken } from "../../entities/refreshTokenState"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("RefreshTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenRepository: Repository<RefreshToken>
  let refreshTokenService: RefreshTokenService
  let buildRefreshTokenService: BuildRefreshTokenService
  let jwtService: JwtService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User)
    )
    refreshTokenRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken)
    )
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService)
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService
    )

    jwtService = module.get<JwtService>(JwtService)
  })

  it("should be defined", () => {
    expect(refreshTokenService).toBeDefined()
  })

  it("should successfully refresh the token", async () => {
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
    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )

    const result = await refreshTokenService.execute(refreshToken, refreshTokenState.userAgent)
    expect(result).toBeDefined()
  })

  it("should fail refreshing the token because refresh token state is revoked", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const refreshTokenState = await refreshTokenRepository.save({
      userId: user.id,
      revoked: true,
      userAgent: "test"
    })
    const refreshToken = await buildRefreshTokenService.execute(
      refreshTokenState
    )
    await expect(
      refreshTokenService.execute(refreshToken, refreshTokenState.userAgent)
    ).rejects.toThrowError(UnauthorizedException)
  })

  it("should fail refreshing the token because refresh token is expired", async () => {
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
    const refreshToken = jwtService.sign(
      { sub: refreshTokenState.id },
      { expiresIn: -10 }
    )
    await expect(
      refreshTokenService.execute(refreshToken, refreshTokenState.userAgent)
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
