import { bootstrapTestingModule } from "../../../../helpers/testHelper"
import { AlterPasswordService } from "../changePassword.service"
import { PasswordResetToken, User } from "../../entities"
import { DataSource } from "typeorm"
import { hash } from "bcrypt"
import { v4 as uuid } from "uuid"

describe("AlterPasswordService (transactional)", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: AlterPasswordService
  let dataSource: DataSource

  // 🔹 Boot the app ONCE
  beforeAll(async () => {
    module = await bootstrapTestingModule()
    service = module.app.get(AlterPasswordService)
    dataSource = module.dataSource
  })

  beforeEach(async () => {
    await module.queryRunner.startTransaction()
  })


  it("successfully alters a password and deletes the token", async () => {
    const userRepo = dataSource.getRepository(User)
    const tokenRepo = dataSource.getRepository(PasswordResetToken)

    const user = await userRepo.save({
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
      password: await hash("oldPassword", 10),
    })

    const token = uuid()

    await tokenRepo.save({
      userId: user.id,
      token,
      validUntil: new Date(2099, 1, 1),
    })

    await service.execute(
      {
        password: "newPassword",
        passwordConfirmation: "newPassword",
      },
      token,
    )

    const updatedUser = await userRepo.findOne({
      where: { id: user.id },
    })

    expect(updatedUser?.password).not.toBe(user.password)

    const deletedToken = await tokenRepo.findOne({
      where: { userId: user.id },
    })

    expect(deletedToken).toBeNull()
  })

  afterEach(async () => {
    await module.queryRunner.rollbackTransaction()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
