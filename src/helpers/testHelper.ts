import { Test } from "@nestjs/testing"
import { DataSource, QueryRunner } from "typeorm"
import { AppModule } from "../modules/app/app.module"
import { INestApplication } from "@nestjs/common"

export async function bootstrapTestingModule(): Promise<{
  app: INestApplication
  dataSource: DataSource
  queryRunner: QueryRunner
}> {
  let queryRunner: QueryRunner | null = null

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DataSource)
    .useFactory({
      inject: [DataSource],
      factory: (dataSource: DataSource): DataSource => {
        return new Proxy<DataSource>(dataSource, {
          get(
            target: DataSource,
            prop: keyof DataSource | symbol,
            receiver: unknown,
          ): unknown {
            if (prop === "manager") {
              if (queryRunner === null) {
                throw new Error("QueryRunner not initialized yet")
              }
              return queryRunner.manager
            }
            return Reflect.get(target, prop, receiver)
          },
        })
      },
    })
    .compile()

  const app = moduleRef.createNestApplication()
  await app.init()

  const dataSource = app.get(DataSource)

  queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()

  return {
    app,
    dataSource,
    queryRunner,
  }
}
