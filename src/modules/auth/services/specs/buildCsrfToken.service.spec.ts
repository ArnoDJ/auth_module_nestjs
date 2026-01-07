import { bootstrapTestingModule } from "./helper"
import { BuildCsrfTokenService } from "../buildCsrfToken.service"

describe("BuildCsrfTokenService", () => {
  let buildCsrfTokenService: BuildCsrfTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    buildCsrfTokenService = module.get<BuildCsrfTokenService>(
      BuildCsrfTokenService
    )
  })

  it("should be defined", () => {
    expect(buildCsrfTokenService).toBeDefined()
  })

  it("should successfully build a session token", () => {
    const result = buildCsrfTokenService.execute()
    expect(result).toBeDefined()
    const splittedResult = result.split(".")
    expect(splittedResult).toHaveLength(3)
  })
})
