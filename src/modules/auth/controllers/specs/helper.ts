import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { AuthModule } from "../../auth.module"
import cookieParser from "cookie-parser"
import { ConfigModule } from "@nestjs/config"
import { DatabaseModule } from "../../../../modules/database/database.module"
import { User } from "../../entities/user"
import { RefreshToken } from "../../entities/refreshTokenState"
import { Bird } from "../../../../modules/birds/entities/bird"
import { Species } from "../../../../modules/birds/entities/species"
import { Couple } from "../../../../modules/birds/entities/couple"
import { Enclosure } from "../../../../modules/birds/entities/enclosure"
import { File } from "../../../../modules/birds/entities/file"

export async function bootstrapTestingModule(): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [".env.test"]
      }),
      AuthModule,
      DatabaseModule.forRoot(),
      DatabaseModule.forFeature([
        User,
        RefreshToken,
        Bird,
        Species,
        Couple,
        Enclosure,
        File
      ])
    ]
  }).compile()
}

export function bootstrapTestApp(moduleRef: TestingModule): INestApplication {
  const app = moduleRef.createNestApplication()
  app.use(cookieParser())
  return app
}
