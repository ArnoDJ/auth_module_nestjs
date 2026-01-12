import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { BuildRefreshTokenService } from "../../tokens/buildRefreshToken.service"
import { RefreshToken } from "../../../../../modules/auth/types/refreshToken"

describe("BuildRefreshTokenService", () => {
  let service: BuildRefreshTokenService

  const jwtService: JwtService = {
    signAsync: jest.fn(),
  } as unknown as JwtService
  const configService = {
    get: jest.fn(),
  } as unknown as ConfigService

  const refreshToken: RefreshToken = {
    id: "refresh-token-id",
    userId: "user-id",
  }

  beforeEach(() => {
    jest.clearAllMocks()
    service = new BuildRefreshTokenService(jwtService, configService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("signs a refresh token with correct payload and expiration", async () => {
    const signSpy = jest
      .spyOn(jwtService, "signAsync")
      .mockResolvedValue("signed-refresh-token")

    configService.get = jest.fn(() => 60 * 60 * 24 * 7)

    const token = await service.execute(refreshToken)

    expect(signSpy).toHaveBeenCalledWith(
      {
        sub: refreshToken.userId,
        sid: refreshToken.id,
      },
      {
        expiresIn: "604800s",
      },
    )

    expect(token).toBe("signed-refresh-token")
  })

  it("uses default expiration when JWT_REFRESH_TOKEN_EXPIRE_TIME is not set", async () => {
    const signSpy = jest
      .spyOn(jwtService, "signAsync")
      .mockResolvedValue("token")

    configService.get = jest.fn(() => undefined)

    await service.execute(refreshToken)

    expect(signSpy).toHaveBeenCalledWith(
      expect.any(Object),
      {
        expiresIn: `${60 * 60 * 24 * 7}s`,
      },
    )
  })

  it("passes the correct payload structure", async () => {
    const signSpy = jest
      .spyOn(jwtService, "signAsync")
      .mockResolvedValue("token")

    configService.get = jest.fn(() => 3600)

    await service.execute(refreshToken)

    const [[payload]] = signSpy.mock.calls

    expect(payload).toEqual({
      sub: refreshToken.userId,
      sid: refreshToken.id,
    })
  })
})
