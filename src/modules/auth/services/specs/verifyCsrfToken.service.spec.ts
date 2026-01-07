import { bootstrapTestingModule } from "./helper"
import { BuildCsrfTokenService } from "../buildCsrfToken.service"
import { VerifyCsrfTokenService } from "../verifyCsrfToken.service"
import { UnauthorizedException } from "@nestjs/common"
import { createHmac } from "crypto"

describe("VerifyCsrfTokenService", () => {
  let buildCsrfTokenService: BuildCsrfTokenService
  let verifyCsrfTokenService: VerifyCsrfTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    buildCsrfTokenService = module.get<BuildCsrfTokenService>(
      BuildCsrfTokenService
    )
    verifyCsrfTokenService = module.get<VerifyCsrfTokenService>(
      VerifyCsrfTokenService
    )
  })

  it("should be defined", () => {
    expect(verifyCsrfTokenService).toBeDefined()
  })

  it("should successfully verfiy a csrf token", () => {
    const token = buildCsrfTokenService.execute()
    const isVerified = verifyCsrfTokenService.execute(token)
    expect(isVerified).toBeTruthy()
  })

  it("should fail validating the csrf token", () => {
    expect(() =>
      verifyCsrfTokenService.execute("sessionId.expiresIn")
    ).toThrowError(UnauthorizedException)
  })

  it("should fail validating the csrf token because it expired", () => {
    const expiresIn = Math.floor(Date.now() / 1000) - 1000
    expect(() =>
      verifyCsrfTokenService.execute(`sessionId.${expiresIn}.hash`)
    ).toThrowError(UnauthorizedException)
  })

  it("should fail verifying the csrf token because hash is invalid", () => {
    const hmac = createHmac("sha256", "test")
    hmac.update("test")
    const hash = hmac.digest("base64")
    const expiresIn = Math.floor(Date.now() / 1000) + 5000
    const isVerified = verifyCsrfTokenService.execute(
      `sessionId.${expiresIn}.${hash}`
    )
    expect(isVerified).toBeFalsy()
  })
})
