import { DynamicModule, Type } from "@nestjs/common"
import {
  TypeOrmModule
} from "@nestjs/typeorm"
import { DatabaseService } from "./database.service"
import { TypeOrmConfigService } from "./typeOrmConfig.service"
import { TransactionalDatabaseService } from "./transactionalDatabase.service"
import { EntitySchema } from "typeorm"

type EntityClassOrSchema =
  | Type<unknown>
  | EntitySchema<unknown>

export class DatabaseModule {
  static forRoot(): DynamicModule {
    const typeOrmRoot = TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    })

    return {
      module: DatabaseModule,
      global: true,
      imports: [typeOrmRoot],
      providers: [DatabaseService, TransactionalDatabaseService],
      exports: [
        typeOrmRoot,
        DatabaseService,
        TransactionalDatabaseService,
      ],
    }
  }

  static forFeature(
    entities?: EntityClassOrSchema[],
  ): DynamicModule {
    if (!entities?.length) {
      return {
        module: DatabaseModule,
        providers: [DatabaseService],
        exports: [DatabaseService],
      }
    }

    const typeOrmFeature = TypeOrmModule.forFeature(entities)

    return {
      module: DatabaseModule,
      imports: [typeOrmFeature],
      providers: [DatabaseService],
      exports: [typeOrmFeature, DatabaseService],
    }
  }
}
