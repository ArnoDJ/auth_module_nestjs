import { bootstrapTestingModule } from "../../../../../helpers/testHelper"
import { DataSource } from "typeorm"
import { FindOrCreateSessionStateService } from "../../sessions/findOrCreateSessionState.service"
import { SessionState, User } from "../../../entities"
import { createUserMock } from "../../../../../mocks/user.mock"

describe("FindOrCreateSessionStateService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: FindOrCreateSessionStateService
  let dataSource: DataSource

  beforeAll(async () => {
    module = await bootstrapTestingModule()
    service = module.app.get(FindOrCreateSessionStateService)
    dataSource = module.dataSource
  })

  beforeEach(async () => {
    await module.queryRunner.startTransaction()
  })

  it("creates a session state when none exists", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())

    const token = await service.execute(user.id, "chrome")

    expect(token).toBeDefined()
    expect(token.userId).toBe(user.id)
    expect(token.userAgent).toBe("chrome")
    expect(token.revoked).toBe(false)

    const tokensInDb = await dataSource
      .getRepository(SessionState)
      .find()

    expect(tokensInDb).toHaveLength(1)
  })

  it("returns existing session state when one exists and is not revoked", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())
    const repo = dataSource.getRepository(SessionState)

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

  it("creates a new session state when existing one is revoked", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())
    const repo = dataSource.getRepository(SessionState)

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

  it("creates separate sessionStates for different user agents", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())

    const chromeToken = await service.execute(user.id, "chrome")
    const firefoxToken = await service.execute(user.id, "firefox")

    expect(chromeToken.id).not.toBe(firefoxToken.id)

    const tokensInDb = await dataSource
      .getRepository(SessionState)
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
