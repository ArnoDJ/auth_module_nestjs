import { ConfigService } from "@nestjs/config"
import { config } from "dotenv"
import { DataSource } from "typeorm"
import { join } from "path"

config({ path: `.env.${process.env.NODE_ENV}` })

const configService = new ConfigService()

export default new DataSource({
  type: "postgres",
  host: configService.get("POSTGRES_HOST"),
  port: Number(configService.get("POSTGRES_PORT")),
  username: configService.get("POSTGRES_USERNAME"),
  password: configService.get("POSTGRES_PASSWORD"),
  database: configService.get("POSTGRES_DATABASE"),

  entities: [
    join(__dirname, "**/*.entity.{ts,js}"),
  ],

  migrations: [
    join(__dirname, "migrations/*{.ts,.js}"),
  ],

  synchronize: false,
})
