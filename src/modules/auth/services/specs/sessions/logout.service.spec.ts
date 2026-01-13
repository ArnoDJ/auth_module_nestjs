import { DataSource } from "typeorm"
import { SessionState, User } from "../../../../../modules/auth/entities"
import { LogoutService } from "../../sessions/logout.service"
import { bootstrapTestingModule } from "../../../../../helpers/testHelper"

describe("LogoutService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: LogoutService
  let dataSource: DataSource

  beforeAll(async () => {
      module = await bootstrapTestingModule()
      service = module.app.get(LogoutService)
      dataSource = module.dataSource
    })

    beforeEach(async () => {
      await module.queryRunner.startTransaction()
    })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should logs out of the application", async () => {
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
    await service.execute(user.id, sessionState.userAgent)

    const oldSessionStorage = await dataSource.getRepository(SessionState).find({ where: { userId: user.id}})
    expect(oldSessionStorage[0].revoked).toBeTruthy()
  })

  afterEach(async () => {
    await module.queryRunner.rollbackTransaction()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
