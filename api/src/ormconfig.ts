import { ConfigService } from "@nestjs/config"
import { DataSource } from "typeorm"
import { join } from "path"

const configService = new ConfigService()

export default new DataSource({
  type: "postgres",
  host: configService.get("POSTGRES_HOST"),
  port: Number(configService.get("POSTGRES_PORT")),
  username: configService.get("POSTGRES_USER"),
  password: configService.get("POSTGRES_PASSWORD"),
  database: configService.get("POSTGRES_DB"),

  entities: [join(__dirname, "**/*.entity.{ts,js}")],
  migrations: [join(__dirname, "migrations/*{.ts,.js}")],
  synchronize: false,
})
