import { bootstrapTestingModule } from "./helper"
import { BuildAccessTokenService } from "../tokens/buildAccessToken.service"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("BuildAccessTokenService", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let buildAccessTokenService: BuildAccessTokenService

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    databaseService = module.get<DatabaseService>(DatabaseService)
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User)
    )
    buildAccessTokenService = module.get<BuildAccessTokenService>(
      BuildAccessTokenService
    )
  })

  it("should be defined", () => {
    expect(buildAccessTokenService).toBeDefined()
  })

  it("should successfully build an access token", async () => {
    const user = await userRepository.save({
      firstName: "test",
      lastName: "test",
      email: "test@test.com",
      password: "test"
    })

    const result = await buildAccessTokenService.execute(user)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await databaseService.closeConnection()
  })
})
