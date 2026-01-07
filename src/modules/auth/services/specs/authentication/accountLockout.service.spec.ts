
import { bootstrapTestingModule } from "../../../../../helpers/testHelper"
import { DataSource } from "typeorm"
import { AccountLockoutService } from "../../authentication/accountLockout.service"
import { User } from "../../../entities"
import { LoginAttemptResultEnum } from "../../../enums/loginAttempResult.enum"
import { createUserMock } from "../../../../../mocks/user.mock"

describe("AccountLockoutService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: AccountLockoutService
  let dataSource: DataSource

  beforeAll(async () => {
    module = await bootstrapTestingModule()
    service = module.app.get(AccountLockoutService)
    dataSource = module.dataSource
  })

  beforeEach(async () => {
    await module.queryRunner.startTransaction()
  })

  it("records a failed login without locking under threshold", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock({ failedLoginAttempts: 2 }))
    await service.execute(user, LoginAttemptResultEnum.FAILURE)

    const updated = await dataSource
      .getRepository(User)
      .findOneByOrFail({ id: user.id })

    expect(updated.failedLoginAttempts).toBe(3)
    expect(updated.lockedUntil).toBeNull()
    expect(updated.lastFailedLoginAt).toBeInstanceOf(Date)
  })

  it("locks the account when threshold is reached", async () => {
    const now = new Date()
    jest.useFakeTimers().setSystemTime(now)
    jest.spyOn(Math, "random").mockReturnValue(0.5)

    const user = await dataSource.getRepository(User).save(await createUserMock({ failedLoginAttempts: 4 }))
    await service.execute(user, LoginAttemptResultEnum.FAILURE)

    const updated = await dataSource
      .getRepository(User)
      .findOneByOrFail({ id: user.id })

    expect(updated.failedLoginAttempts).toBe(5)
    expect(updated.lockedUntil).not.toBeNull()
    expect(updated.lockedUntil!.getTime()).toBeGreaterThan(now.getTime())

    jest.useRealTimers()
  })

  it("throws when account is already locked", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock({ lockedUntil: new Date(Date.now() + 60_000) }))
    await expect(
      service.execute(user, LoginAttemptResultEnum.FAILURE),
    ).rejects.toThrow("ACCOUNT_LOCKED")
  })

  it("reduces failed attempts on successful login", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock({ failedLoginAttempts: 5 }))
    await service.execute(user, LoginAttemptResultEnum.SUCCESS)
    const updated = await dataSource
      .getRepository(User)
      .findOneByOrFail({ id: user.id })

    expect(updated.failedLoginAttempts).toBe(3)
    expect(updated.lockedUntil).toBeNull()
    expect(updated.lastFailedLoginAt).toBeNull()
  })

  it("never reduces failed attempts below zero", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock({ failedLoginAttempts: 1 }))
    await service.execute(user, LoginAttemptResultEnum.SUCCESS)
    const updated = await dataSource
      .getRepository(User)
      .findOneByOrFail({ id: user.id })

    expect(updated.failedLoginAttempts).toBe(0)
  })

    afterEach(async () => {
    await module.queryRunner.rollbackTransaction()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
