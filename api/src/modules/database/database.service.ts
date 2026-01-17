import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource, EntityMetadata, QueryRunner } from "typeorm"

export class DatabaseService {
  private queryRunner?: QueryRunner
  connection: any
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async cleanAll(): Promise<void> {
    await this.dataSource.query("EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'")
    const entities = this.getEntities()
    for (const entity of entities) {
      if (entity.tableType === "regular") {
        const tableName = entity.tableName
        await this.dataSource.query(`DELETE FROM [${tableName}]`)
      }
    }
    await this.dataSource.query(
      "EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'"
    )
  }

  public async closeConnection(): Promise<void> {
    await this.dataSource.destroy()
  }

  private getEntities(): EntityMetadata[] {
    return this.dataSource.entityMetadatas
  }

  public async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner()
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
  }

  public async rollbackTransaction(): Promise<void> {
    if (this.queryRunner) {
      try {
        await this.queryRunner.rollbackTransaction()
      } finally {
        await this.queryRunner.release()
        this.queryRunner = undefined
      }
    }
  }
}
