import { bootstrapTestingModule } from "./helper"
import { BuildCookieWithCsrfTokenService } from "../cookies/buildCookieWithCsrfToken.service"

describe("BuildCookieWithCsrfTokenService", () => {
  let buildCookieWithCsrfTokenService: BuildCookieWithCsrfTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    buildCookieWithCsrfTokenService = module.get<
      BuildCookieWithCsrfTokenService
    >(BuildCookieWithCsrfTokenService)
  })

  it("should be defined", () => {
    expect(buildCookieWithCsrfTokenService).toBeDefined()
  })

  it("should successfully build a csrf cookie", () => {
    const result = buildCookieWithCsrfTokenService.execute("token")
    expect(result).toBeDefined()
  })
})
