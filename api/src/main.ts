import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import cookieParser from "cookie-parser"
import { NestExpressApplication } from "@nestjs/platform-express"
import { join } from "path"
import { AppModule } from "./modules/app/app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || AppModule.allowedOrigins.length === 0) {
        callback(null, true)
        return
      }
      const isAllowed = AppModule.allowedOrigins.includes(origin)
      callback(null, isAllowed)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })

  app.use((req: { origin: any }, res: any, next: () => void) => {
    console.log(req.origin)
    next()
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  app.use(cookieParser())
  app.useStaticAssets(join(__dirname, "..", "public"))
  app.enableShutdownHooks()

  // To convert the strings in form data to objects
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))

  const config = new DocumentBuilder()
    .setTitle(AppModule.apiTitle)
    .setDescription(AppModule.apiDescription)
    .setVersion(AppModule.apiVersion)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  console.log("Finance Api running on PORT:", AppModule.port)
  await app.listen(Number(process.env.PORT ?? 8080), "0.0.0.0")
}
void bootstrap()
