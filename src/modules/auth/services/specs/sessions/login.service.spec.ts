import { bootstrapTestingModule } from "../../../../../helpers/testHelper"
import { DataSource } from "typeorm"
import { User } from "../../../entities"
import { UnauthorizedException } from "@nestjs/common"
import { AuthenticateService } from "../../credentials/authenticate.service"
import { AccountLockoutService } from "../../credentials/accountLockout.service"
import { LoginAttemptResultEnum } from "../../../enums/loginAttempResult.enum"
import { createUserMock } from "../../../../../mocks/user.mock"

describe("AuthenticateService", () => {
  let module: Awaited<ReturnType<typeof bootstrapTestingModule>>
  let service: AuthenticateService
  let lockoutExecuteSpy: jest.SpiedFunction<AccountLockoutService["execute"]>
  let lockoutService: AccountLockoutService
  let dataSource: DataSource

  beforeAll(async () => {
    module = await bootstrapTestingModule()
    service = module.app.get(AuthenticateService)
    lockoutExecuteSpy = module.app.get(AccountLockoutService)
    lockoutService = module.app.get(AccountLockoutService)
    dataSource = module.dataSource
  })

  beforeEach(async () => {
    await module.queryRunner.startTransaction()

    lockoutExecuteSpy = jest
      .spyOn(lockoutService, "execute")
      .mockImplementation(async () => {})
  })

  it("returns UserDto on valid credentials", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())

    const result = await service.execute({
      email: user.email,
      password: "IAmIronMan123!",
    })

    expect(result.id).toBe(user.id)
    expect(result.email).toBe(user.email)

    expect(lockoutExecuteSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id }),
      LoginAttemptResultEnum.SUCCESS,
    )
  })

  it("throws UnauthorizedException on wrong password", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())

    await expect(
      service.execute({
        email: user.email,
        password: "wrong-password",
      }),
    ).rejects.toThrow(UnauthorizedException)

    expect(lockoutExecuteSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id }),
      LoginAttemptResultEnum.FAILURE,
    )
  })

  it("throws UnauthorizedException when user does not exist", async () => {
    await expect(
      service.execute({
        email: "missing@test.com",
        password: "whatever",
      }),
    ).rejects.toThrow(UnauthorizedException)

    expect(lockoutExecuteSpy).not.toHaveBeenCalled()
  })

  it("never leaks whether the email exists", async () => {
    const user = await dataSource.getRepository(User).save(await createUserMock())

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
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await module.queryRunner.release()
    await module.app.close()
  })
})
