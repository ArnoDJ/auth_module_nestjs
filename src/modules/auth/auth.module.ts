import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { BuildCookieWithRefreshTokenService } from "./services/cookies/buildCookieWithRefreshToken.service"
import { AuthenticateService } from "./services/authentication/authenticate.service"
import { AuthController } from "./controllers/auth.controller"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { FindOrCreateRefreshTokenStateService } from "./services/authentication/findOrCreateRefreshTokenState.service"
import { BuildAccessTokenService } from "./services/tokens/buildAccessToken.service"
import { RefreshTokenController } from "./controllers/refreshToken.controller"
import { GetRefreshTokenStateByIdService } from "./services/getRefreshTokenStateById.service"
import { BuildRefreshTokenService } from "./services/tokens/buildRefreshToken.service"
import { RefreshTokenService } from "./services/refreshToken.service"
import { BuildCookieWithCsrfTokenService } from "./services/cookies/buildCookieWithCsrfToken.service"
import { VerifyCsrfTokenService } from "./services/verifyCsrfToken.service"
import { BuildCsrfTokenService } from "./services/buildCsrfToken.service"
import { LogoutService } from "./services/logout.service"
import { GetRefreshTokenStateByUserAndAgentService } from "./services/getRefreshTokenByUserAndAgent.service"
import { DatabaseModule } from "../database/database.module"
import { User } from "./entities/user"
import { RefreshToken } from "./entities/refreshTokenState"
import { PasswordResetToken } from "./entities/passwordResetToken"
import { PasswordResetService } from "./services/passwordReset.service"
import { AlterPasswordService } from "./services/alterPassword.service"
import { AuthCookieInterceptor } from "./interceptors/authCookie.interceptor"

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: `${
            configService.get<number>("JWT_ACCESS_TOKEN_EXPIRE_TIME") ?? 3800
          }s`
        }
      })
    }),
    DatabaseModule.forFeature([
      User,
      RefreshToken,
      PasswordResetToken
    ]),
  ],
  controllers: [AuthController, RefreshTokenController],
  providers: [
    BuildCookieWithRefreshTokenService,
    AuthenticateService,
    JwtStrategy,
    FindOrCreateRefreshTokenStateService,
    BuildAccessTokenService,
    BuildRefreshTokenService,
    GetRefreshTokenStateByIdService,
    BuildCookieWithCsrfTokenService,
    RefreshTokenService,
    VerifyCsrfTokenService,
    BuildCsrfTokenService,
    LogoutService,
    GetRefreshTokenStateByUserAndAgentService,
    PasswordResetService,
    AlterPasswordService,
    AuthCookieInterceptor
  ],
  exports: [BuildAccessTokenService, JwtModule]
})
export class AuthModule {}
