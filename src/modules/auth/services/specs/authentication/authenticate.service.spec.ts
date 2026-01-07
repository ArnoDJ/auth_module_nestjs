import { bootstrapTestingModule } from "../../../../../helpers/testHelper"
import { DataSource } from "typeorm"
import { User } from "../../../entities"
import { UnauthorizedException } from "@nestjs/common"
import { AuthenticateService } from "../../authentication/authenticate.service"
import { createUserMock } from "../../../../../mocks/user.mock"

describe("AuthenticateService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: AuthenticateService
  let dataSource: DataSource

  beforeAll(async () => {
    module = await bootstrapTestingModule()
    service = module.app.get(AuthenticateService)
    dataSource = module.dataSource
  })

  beforeEach(async () => {
    await module.queryRunner.startTransaction()
  })

  it("returns UserDto on valid credentials", async () => {
    const user = await dataSource
      .getRepository(User)
      .save(await createUserMock())

    const result = await service.execute({
      email: user.email,
      password: "IAmIronMan123!",
    })

    expect(result.id).toBe(user.id)
    expect(result.email).toBe(user.email)

    const updatedUser = await dataSource
      .getRepository(User)
      .findOneByOrFail({ id: user.id })

    expect(updatedUser.failedLoginAttempts).toBe(0)
    expect(updatedUser.lockedUntil).toBeNull()
  })

  it("increments failed login attempts on wrong password", async () => {
    const user = await dataSource
      .getRepository(User)
      .save(await createUserMock())

    await expect(
      service.execute({
        email: user.email,
        password: "wrong-password",
      }),
    ).rejects.toThrow(UnauthorizedException)

    const updatedUser = await dataSource
      .getRepository(User)
      .findOneByOrFail({ id: user.id })

    expect(updatedUser.failedLoginAttempts).toBe(1)
  })

  it("locks the account after repeated failures", async () => {
    const user = await dataSource
      .getRepository(User)
      .save(await createUserMock())
    for (let i = 0; i < 5; i++) {
      await expect(
        service.execute({
          email: user.email,
          password: "wrong-password",
        }),
      ).rejects.toThrow(UnauthorizedException)
    }

    const lockedUser = await dataSource
      .getRepository(User)
      .findOneByOrFail({ id: user.id })

    expect(lockedUser.lockedUntil).not.toBeNull()
    expect(lockedUser.lockedUntil!.getTime()).toBeGreaterThan(Date.now())
  })

  it("never leaks whether the email exists", async () => {
    const user = await dataSource
      .getRepository(User)
      .save(await createUserMock())

    await expect(
      service.execute({
        email: user.email,
        password: "wrong-password",
      }),
    ).rejects.toThrow(UnauthorizedException)

    await expect(
      service.execute({
        email: "missing@test.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow(UnauthorizedException)
  })

  afterEach(async () => {
    await module.queryRunner.rollbackTransaction()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
