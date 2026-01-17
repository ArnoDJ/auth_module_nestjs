import { hash } from "bcrypt"
import { DataSource } from "typeorm"
import { bootstrapTestingModule } from "../../../../../helpers/testHelper"
import { PasswordResetToken, User } from "../../../entities"
import { PasswordResetRequestService } from "../../identity/passwordResetRequest.service"

describe("PasswordResetRequestService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: PasswordResetRequestService
  let dataSource: DataSource

  beforeAll(async () => {
    module = await bootstrapTestingModule()
    service = module.app.get(PasswordResetRequestService)
    dataSource = module.dataSource
  })

  beforeEach(async () => {
    await module.queryRunner.startTransaction()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should successfully create a passwordResetToken", async () => {
    const user = await dataSource.getRepository(User).save({
      firstName: "test",
      lastName: "test",
      email: "arno@pau.be",
      password: await hash("test", 10)
    })

    await service.execute(
      user.email
    )
    const removedToken = await dataSource.getRepository(PasswordResetToken).findOne({ where: { userId: user.id }})
    expect(removedToken).toBeDefined()
  })

  afterEach(async () => {
    await module.queryRunner.rollbackTransaction()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
