import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { BuildAccessTokenService } from "../../tokens/buildAccessToken.service"

describe("BuildAccessTokenService", () => {
  let service: BuildAccessTokenService

  const jwtService: JwtService = {
  signAsync: jest.fn(),
} as unknown as JwtService

  const configService = {
    get: jest.fn(),
  } as unknown as ConfigService

  const user = {
    id: "user-id",
    admin: true,
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    service = new BuildAccessTokenService(jwtService, configService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("signs a JWT with correct payload", async () => {
    const signSpy = jest
      .spyOn(jwtService, "signAsync")
      .mockResolvedValue("signed-token")

    configService.get = jest.fn(() => 900)

    const token = await service.execute(user)

    expect(signSpy).toHaveBeenCalledWith(
      {
        sub: user.id,
        admin: user.admin,
      },
      {
        expiresIn: "900s",
      },
    )

    expect(token).toBe("signed-token")
  })

  it("uses default expiration when config is not set", async () => {
    const signSpy = jest
      .spyOn(jwtService, "signAsync")
      .mockResolvedValue("token")

    configService.get = jest.fn(() => undefined)

    await service.execute(user)

    expect(signSpy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        expiresIn: "900s",
      },
    )
  })

  it("throws if expiration time is zero", async () => {
    configService.get = jest.fn(() => 0)

    await expect(service.execute(user)).rejects.toThrow(
      "JWT_ACCESS_TOKEN_EXPIRE_TIME must be a positive integer",
    )
  })

  it("throws if expiration time is negative", async () => {
    configService.get = jest.fn(() => -10)

    await expect(service.execute(user)).rejects.toThrow(
      "JWT_ACCESS_TOKEN_EXPIRE_TIME must be a positive integer",
    )
  })

  it("throws if expiration time is not an integer", async () => {
    configService.get = jest.fn(() => "abc" as unknown as number)

    await expect(service.execute(user)).rejects.toThrow(
      "JWT_ACCESS_TOKEN_EXPIRE_TIME must be a positive integer",
    )
  })
})

