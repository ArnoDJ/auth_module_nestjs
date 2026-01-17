import { UnauthorizedException } from "@nestjs/common"
import { DataSource } from "typeorm"
import { SessionState, User } from "../../../entities"
import { GetSessionStateByIdService } from "../../sessions/getSessionStateById.service"
import { bootstrapTestingModule } from "../../../../../helpers/testHelper"

describe("GetSessionStateByIdService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: GetSessionStateByIdService
  let dataSource: DataSource

  beforeAll(async () => {
      module = await bootstrapTestingModule()
      service = module.app.get(GetSessionStateByIdService)
      dataSource = module.dataSource
    })

    beforeEach(async () => {
      await module.queryRunner.startTransaction()
    })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should successfully get a refresh token state by id", async () => {
    const user = await dataSource.getRepository(User).save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })
    const sessionState = await dataSource.getRepository(SessionState).save({
      userId: user.id,
      revoked: false,
      userAgent: "test"
    })

    const result = await service.execute(
      sessionState.id
    )
    expect(result).toBeDefined()
    expect(result.userId).toBe(user.id)
  })

  it("should not get a refresh token state by id because it does not exist", async () => {
    await expect(
      service.execute(
        "69166027-ba03-40ac-8e31-bc12091eeb2f"
      )
    ).rejects.toThrow(UnauthorizedException)
  })

  afterEach(async () => {
    await module.queryRunner.rollbackTransaction()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
