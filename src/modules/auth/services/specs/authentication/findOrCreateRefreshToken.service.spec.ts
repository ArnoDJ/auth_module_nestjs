import { bootstrapTestingModule } from "../../../../../helpers/testHelper"
import { DataSource } from "typeorm"
import { FindOrCreateRefreshTokenStateService } from "../../authentication/findOrCreateRefreshTokenState.service"
import { createUserMock } from "../../../../../mocks/user.mock"
import { RefreshTokenState, User } from "../../../entities"

describe("FindOrCreateRefreshTokenService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: FindOrCreateRefreshTokenStateService
  let dataSource: DataSource

  beforeAll(async () => {
    module = await bootstrapTestingModule()
    service = module.app.get(FindOrCreateRefreshTokenStateService)
    dataSource = module.dataSource
  })

  beforeEach(async () => {
    await module.queryRunner.startTransaction()
  })

  it("creates a refresh token when none exists", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())

    const token = await service.execute(user.id, "chrome")

    expect(token).toBeDefined()
    expect(token.userId).toBe(user.id)
    expect(token.userAgent).toBe("chrome")
    expect(token.revoked).toBe(false)

    const tokensInDb = await dataSource
      .getRepository(RefreshTokenState)
      .find()

    expect(tokensInDb).toHaveLength(1)
  })

  it("returns existing refresh token when one exists and is not revoked", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())
    const repo = dataSource.getRepository(RefreshTokenState)

    const existing = await repo.save({
      userId: user.id,
      userAgent: "chrome",
      revoked: false,
    })

    const token = await service.execute(user.id, "chrome")

    expect(token.id).toBe(existing.id)

    const tokensInDb = await repo.find()
    expect(tokensInDb).toHaveLength(1)
  })

  it("creates a new refresh token when existing one is revoked", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())
    const repo = dataSource.getRepository(RefreshTokenState)

    await repo.save({
      userId: user.id,
      userAgent: "chrome",
      revoked: true,
    })

    const token = await service.execute(user.id, "chrome")

    expect(token.revoked).toBe(false)

    const tokensInDb = await repo.find()
    expect(tokensInDb).toHaveLength(2)
  })

  it("creates separate tokens for different user agents", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())

    const chromeToken = await service.execute(user.id, "chrome")
    const firefoxToken = await service.execute(user.id, "firefox")

    expect(chromeToken.id).not.toBe(firefoxToken.id)

    const tokensInDb = await dataSource
      .getRepository(RefreshTokenState)
      .find()

    expect(tokensInDb).toHaveLength(2)
  })

  it("throws if user does not exist", async () => {
    await expect(
      service.execute("non-existent-id", "chrome"),
    ).rejects.toThrow()
  })

  afterEach(async () => {
    await module.queryRunner.rollbackTransaction()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
