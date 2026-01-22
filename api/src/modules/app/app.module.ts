import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common"
import { join } from "path"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ServeStaticModule } from "@nestjs/serve-static"
import { DatabaseModule } from "../database/database.module"
import { AppController } from "./app.controller"
import { LoggerMiddleware } from "../../middleware/logger.middleware"
import { AuthModule } from "../auth/auth.module"

// eslint-disable-next-line @typescript-eslint/naming-convention
const runningOnAppService = !!process.env.WEBSITE_SITE_NAME

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: runningOnAppService,
      envFilePath: runningOnAppService
        ? []
        : process.env.NODE_ENV
          ? [`.env.${process.env.NODE_ENV}`, ".env"]
          : [".env"],
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    DatabaseModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  public static port: string | number
  public static apiVersion: string
  public static apiTitle: string
  public static apiDescription: string
  public static allowedOrigins: string[]

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get<number>("PORT") ?? 3000
    AppModule.apiVersion = this.configService.get<string>("API_VERSION") ?? "1.0"
    AppModule.apiTitle = this.configService.get<string>("API_TITLE") ?? "API"
    AppModule.apiDescription = this.configService.get<string>("API_DESCRIPTION") ?? "Api backend"
    AppModule.allowedOrigins = this.parseAllowedOrigins(
      this.configService.get<string>("ALLOWED_ORIGINS") ?? "*"
    )
  }

  private parseAllowedOrigins(allowedOriginsFromConfig: string): string[] {
    // Treat "*" or empty as "allow all"
    if (!allowedOriginsFromConfig || allowedOriginsFromConfig.trim() === "*") {
      return []
    }
    return allowedOriginsFromConfig
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
