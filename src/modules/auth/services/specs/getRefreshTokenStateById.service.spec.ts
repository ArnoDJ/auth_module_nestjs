import { bootstrapTestingModule } from "./helper"
import { GetRefreshTokenStateByIdService } from "../getRefreshTokenStateById.service"
import { UnauthorizedException } from "@nestjs/common"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { RefreshToken } from "../../entities/refreshTokenState"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("GetRefreshTokenStateByIdService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let refreshTokenRepository: Repository<RefreshToken>
  let getRefreshTokenStateByIdService: GetRefreshTokenStateByIdService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User)
    )
    refreshTokenRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken)
    )
    getRefreshTokenStateByIdService = module.get<
      GetRefreshTokenStateByIdService
    >(GetRefreshTokenStateByIdService)
  })

  it("should be defined", () => {
    expect(getRefreshTokenStateByIdService).toBeDefined()
  })

  it("should successfully get a refresh token state by id", async () => {
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

    const result = await getRefreshTokenStateByIdService.execute(
      refreshTokenState.id
    )
    expect(result).toBeDefined()
    expect(result.userId).toBe(user.id)
  })

  it("should not get a refresh token state by id because it does not exist", async () => {
    await expect(
      getRefreshTokenStateByIdService.execute(
        "69166027-ba03-40ac-8e31-bc12091eeb2f"
      )
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
