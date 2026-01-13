import { BuildRefreshTokenCookieService } from "../../cookies/buildRefreshTokenCookie.service"
import { ConfigService } from "@nestjs/config"

describe("BuildCookieWithRefreshTokenService", () => {
  let service: BuildRefreshTokenCookieService
  let configService: {
    get: jest.Mock<string | undefined, [string]>
  }

  beforeEach(() => {
    configService = {
      get: jest.fn<string | undefined, [string]>(),
    }

    service = new BuildRefreshTokenCookieService(
      configService as unknown as ConfigService,
    )
  })

  it("builds a refresh token cookie with configured max age", () => {
    configService.get.mockReturnValue("7200")

    const result = service.execute("refresh-token-value")

    expect(result).toBe(
      "refreshToken=refresh-token-value; HttpOnly; Secure; Path=/auth/refresh_token; SameSite=None; Max-Age=7200",
    )
  })

  it("falls back to default max age when config value is missing", () => {
    configService.get.mockReturnValue(undefined)

    const result = service.execute("refresh-token-value")

    expect(result).toBe(
      "refreshToken=refresh-token-value; HttpOnly; Secure; Path=/auth/refresh_token; SameSite=None; Max-Age=3800",
    )
  })
})
