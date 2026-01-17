import { ConfigService } from "@nestjs/config"
import { createHmac } from "crypto"
import { BuildCsrfTokenService } from "../../csrf/buildCsrfToken.service"

describe("BuildCsrfTokenService", () => {
  let service: BuildCsrfTokenService

  const configService = {
    get: jest.fn(),
  } as unknown as ConfigService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new BuildCsrfTokenService(configService)
  })

  it("builds a valid CSRF token with correct structure", () => {
    configService.get = jest.fn((key: string) => {
      if (key === "CSRF_SECRET") return "super-secret"
      if (key === "CSRF_TOKEN_TTL") return 3600
      return undefined
    })

    const refreshTokenStateId = "refresh-token-id"
    const token = service.execute(refreshTokenStateId)

    const parts = token.split(".")
    expect(parts).toHaveLength(5)

    const [version, nonce, expiresAt, tokenId, hmac] = parts

    expect(version).toBe("v1")
    expect(nonce).toMatch(/^[a-f0-9]{64}$/)
    expect(Number(expiresAt)).toBeGreaterThan(Math.floor(Date.now() / 1000))
    expect(tokenId).toBe(refreshTokenStateId)
    expect(hmac.length).toBeGreaterThan(0)
  })

  it("generates a verifiable HMAC signature", () => {
    const secret = "super-secret"
    const ttl = 3600

    configService.get = jest.fn((key: string) => {
      if (key === "CSRF_SECRET") return secret
      if (key === "CSRF_TOKEN_TTL") return ttl
      return undefined
    })

    const refreshTokenStateId = "refresh-id"
    const token = service.execute(refreshTokenStateId)

    const [, nonce, expiresAt, tokenId, hmac] = token.split(".")

    const expectedHmac = createHmac("sha256", secret)
      .update(`v1.${nonce}.${expiresAt}.${tokenId}`)
      .digest("base64url")

    expect(hmac).toBe(expectedHmac)
  })

  it("throws if CSRF_SECRET is not configured", () => {
    configService.get = jest.fn(() => undefined)

    expect(() =>
      service.execute("refresh-token-id"),
    ).toThrow("CSRF_SECRET is not configured")
  })

  it("uses default TTL when CSRF_TOKEN_TTL is not set", () => {
    configService.get = jest.fn((key: string) => {
      if (key === "CSRF_SECRET") return "secret"
      return undefined
    })

    const now = Math.floor(Date.now() / 1000)
    const token = service.execute("refresh-id")
    const [, , expiresAt] = token.split(".")

    expect(Number(expiresAt)).toBeGreaterThanOrEqual(now + 60 * 60 * 24 - 2)
  })

  it("produces different tokens for multiple calls", () => {
    configService.get = jest.fn((key: string) => {
      if (key === "CSRF_SECRET") return "secret"
      return 3600
    })

    const token1 = service.execute("refresh-id")
    const token2 = service.execute("refresh-id")

    expect(token1).not.toBe(token2)
  })
})
