import { Injectable } from "@nestjs/common"
import { DataSource, EntityManager, QueryRunner } from "typeorm"

@Injectable()
export class TransactionalDatabaseService {
  private queryRunner: QueryRunner

  constructor(private readonly dataSource: DataSource) {}

  getDataSource(): DataSource {
    return this.dataSource
  }

  async startTransaction(): Promise<EntityManager> {
    this.queryRunner = this.dataSource.createQueryRunner()
    await this.queryRunner.startTransaction()
    return this.queryRunner.manager
  }

  async rollbackTransaction(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.queryRunner) return
    await this.queryRunner.rollbackTransaction()
    await this.queryRunner.release()
  }

  async commitTransaction(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.queryRunner) return
    await this.queryRunner.commitTransaction()
    await this.queryRunner.release()
  }

  async cleanAll(): Promise<void> {
    // Disable FK constraints temporarily
    await this.dataSource.query("EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'")

    const entities = this.dataSource.entityMetadatas
    for (const entity of entities) {
      if (entity.tableType === "regular") {
        await this.dataSource.query(`DELETE FROM [${entity.tableName}]`)
      }
    }

    // Re-enable constraints
    await this.dataSource.query("EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'")
  }

  async close(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy()
    }
  }
}
