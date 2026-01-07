import { Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"

export type DatabaseEnvironmentVariables = {
  NODE_ENV: string
  POSTGRES_PORT: number
  POSTGRES_HOST: string
  POSTGRES_DATABASE: string
  POSTGRES_USERNAME: string
  POSTGRES_PASSWORD: string
  LOG_SQL: boolean
}

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<DatabaseEnvironmentVariables>
  ) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      type: "postgres",
      host: this.configService.get<string>("POSTGRES_HOST"),
      port: this.configService.get<number>("POSTGRES_PORT"),
      database: this.configService.get<string>("POSTGRES_DATABASE"),
      username: this.configService.get<string>("POSTGRES_USERNAME"),
      password: this.configService.get<string>("POSTGRES_PASSWORD"),
      autoLoadEntities: true,
      migrations: [this.migrationsDir],
      synchronize: false,
      logging: this.isLogging()
    }

    return options
  }

  private get isDev(): boolean {
    return this.configService.get<string>("NODE_ENV") === "development"
  }

  private get isProd(): boolean {
    return this.configService.get<string>("NODE_ENV") === "production"
  }

  private get migrationsDir(): string {
    return `${__dirname}/migrations/**/*.{ts,js}`
  }


  private isLogging(): boolean {
    if (this.isProd) {
      return false
    } else if (this.willLogSql) {
      return true
    } else {
      return false
    }
  }

  public get willLogSql(): boolean {
    return this.configService.get<string>("LOG_SQL") === "true"
  }
}
