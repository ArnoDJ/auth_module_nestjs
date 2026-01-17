import { BuildCsrfCookieService } from "../../cookies/buildCsrfCookie.service"
import { ConfigService } from "@nestjs/config"

describe("BuildCsrfCookieService", () => {
  let service: BuildCsrfCookieService
  let configService: jest.Mocked<ConfigService>

  beforeEach(() => {
    configService = new ConfigService() as jest.Mocked<ConfigService>
    jest.spyOn(configService, "get")

    service = new BuildCsrfCookieService(configService)
  })

  it("builds a CSRF cookie with configured TTL", () => {
    configService.get.mockReturnValue(3600)

    const result = service.execute("csrf-token-value")

    expect(result).toBe(
      "_csrf=csrf-token-value; Path=/; Secure; SameSite=None; Max-Age=3600",
    )
  })

  it("falls back to default TTL when config value is missing", () => {
    configService.get.mockReturnValue(undefined)

    const result = service.execute("csrf-token-value")

    expect(result).toBe(
      "_csrf=csrf-token-value; Path=/; Secure; SameSite=None; Max-Age=86400",
    )
  })
})
