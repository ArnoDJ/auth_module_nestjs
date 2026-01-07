import { BuildCookieWithRefreshTokenService } from "../../cookies/buildCookieWithRefreshToken.service"
import { ConfigService } from "@nestjs/config"

describe("BuildCookieWithRefreshTokenService", () => {
  let service: BuildCookieWithRefreshTokenService
  let configService: jest.Mocked<ConfigService>

  beforeEach(() => {
    configService = new ConfigService() as jest.Mocked<ConfigService>
    jest.spyOn(configService, "get")

    service = new BuildCookieWithRefreshTokenService(configService)
  })

  it("builds a refresh token cookie with configured max age", () => {
    configService.get.mockReturnValue("7200")

    const result = service.execute("refresh-token-value")

    expect(result).toBe(
      "refreshToken=refresh-token-value; HttpOnly; Secure; Path=/auth/refresh_token; SameSite=None; Max-Age=7200",
    )

    expect(configService.get).toHaveBeenCalledWith("COOKIE_EXPIRE_TIME")
  })

  it("falls back to default max age when config value is missing", () => {
    configService.get.mockReturnValue(undefined)

    const result = service.execute("refresh-token-value")

    expect(result).toBe(
      "refreshToken=refresh-token-value; HttpOnly; Secure; Path=/auth/refresh_token; SameSite=None; Max-Age=3800",
    )
  })
})
