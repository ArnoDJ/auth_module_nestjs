import { ConfigService } from "@nestjs/config"
import { UnauthorizedException } from "@nestjs/common"
import { BuildCsrfTokenService } from "../../csrf/buildCsrfToken.service"
import { VerifyCsrfTokenService } from "../../csrf/verifyCsrfToken.service"

describe("VerifyCsrfTokenService", () => {
  let buildService: BuildCsrfTokenService
  let verifyService: VerifyCsrfTokenService

  const configService = {
    get: jest.fn(),
  } as unknown as ConfigService

  beforeEach(() => {
    jest.clearAllMocks()

    configService.get = jest.fn((key: string) => {
      if (key === "CSRF_SECRET") return "super-secret"
      if (key === "CSRF_TOKEN_TTL") return 3600
      return undefined
    })

    buildService = new BuildCsrfTokenService(configService)
    verifyService = new VerifyCsrfTokenService(configService)
  })

  it("accepts a valid CSRF token", () => {
    const token = buildService.execute("refresh-id")

    expect(() => verifyService.execute(token)).not.toThrow()
  })

  it("rejects an expired token", () => {
    const token = buildService.execute("refresh-id")
    const parts = token.split(".")

    parts[2] = "1" // expired timestamp

    const expiredToken = parts.join(".")

    expect(() =>
      verifyService.execute(expiredToken),
    ).toThrow(UnauthorizedException)
  })

  it("rejects a token with a modified refreshTokenStateId", () => {
    const token = buildService.execute("refresh-id")
    const parts = token.split(".")

    parts[3] = "other-refresh-id"

    const tamperedToken = parts.join(".")

    expect(() =>
      verifyService.execute(tamperedToken),
    ).toThrow(UnauthorizedException)
  })

  it("rejects a token with an invalid signature", () => {
    const token = buildService.execute("refresh-id")
    const parts = token.split(".")

    parts[4] = "invalid-signature"

    const invalidToken = parts.join(".")

    expect(() =>
      verifyService.execute(invalidToken),
    ).toThrow(UnauthorizedException)
  })

  it("rejects a token with an invalid format", () => {
    expect(() =>
      verifyService.execute("this.is.not.valid"),
    ).toThrow(UnauthorizedException)
  })

  it("rejects a token with an unsupported version", () => {
    const token = buildService.execute("refresh-id")
    const parts = token.split(".")

    parts[0] = "v2"

    const invalidVersionToken = parts.join(".")

    expect(() =>
      verifyService.execute(invalidVersionToken),
    ).toThrow(UnauthorizedException)
  })

  it("rejects a token with a non-numeric expiresAt", () => {
    const token = buildService.execute("refresh-id")
    const parts = token.split(".")

    parts[2] = "NaN"

    const invalidToken = parts.join(".")

    expect(() =>
      verifyService.execute(invalidToken),
    ).toThrow(UnauthorizedException)
  })

  it("throws if CSRF_SECRET is not configured", () => {
    configService.get = jest.fn(() => undefined)

    const token = buildService.execute("refresh-id")

    expect(() =>
      verifyService.execute(token),
    ).toThrow("CSRF_SECRET is not configured")
  })
})
