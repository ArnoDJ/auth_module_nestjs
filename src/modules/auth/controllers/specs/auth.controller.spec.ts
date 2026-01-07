/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp, bootstrapTestingModule } from "./helper"
import { hash } from "bcrypt"
import { DatabaseService } from "../../../../modules/database/database.service"
import { Repository } from "typeorm"
import { User } from "../../entities/user"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("Auth Controller", () => {
  let databaseService: DatabaseService
  let userRepository: Repository<User>
  let app: INestApplication

  beforeAll(async () => {
    const module = await bootstrapTestingModule()
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User)
    )
    app = bootstrapTestApp(module)
    await app.init()

    databaseService = module.get<DatabaseService>(DatabaseService)
  })

  it("app should be defined", () => {
    expect(app).toBeDefined()
  })

  describe("/POST", () => {
    it("/POST /auth/token successfully authenticates a user ", async () => {
      const user = await userRepository.save({
        firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: await hash("test", 10)
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: user.email,
          password: "test"
        })
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toHaveLength(2)
    })

    it("/POST /auth/token fails authenticating a user because password is wrong", async () => {
      const user = await userRepository.save({
        firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: await hash("test", 10)
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: user.email,
          password: "wrongpassword"
        })
        .expect(401)
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toBeUndefined()
    })

    it("/POST /auth/token fails authenticating a user because user is not found with email", async () => {
      await userRepository.save({
        firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password: await hash("test", 10)
      })
      const response = await request(app.getHttpServer())
        .post("/auth/token")
        .set("user-agent", "test")
        .send({
          email: "email@notexists.com",
          password: "test"
        })
        .expect(401)
      expect(response.body).toBeDefined()
      expect(response.header["set-cookie"]).toBeUndefined()
    })
  })

  afterEach(async () => {
    await databaseService.cleanAll()
  })

  afterAll(async () => {
    await app.close()
  })
})
