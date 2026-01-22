import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { AuthenticateService } from "./services/credentials/authenticate.service"
import { AuthController } from "./controllers/auth.controller"
import { FindOrCreateSessionStateService } from "./services/sessions/findOrCreateSessionState.service"
import { BuildAccessTokenService } from "./services/tokens/buildAccessToken.service"
import { RefreshTokenController } from "./controllers/refreshToken.controller"
import { BuildRefreshTokenService } from "./services/tokens/buildRefreshToken.service"
import { RefreshSessionService } from "./services/sessions/refreshSession.service"
import { BuildCsrfCookieService } from "./services/cookies/buildCsrfCookie.service"
import { VerifyCsrfTokenService } from "./services/csrf/verifyCsrfToken.service"
import { BuildCsrfTokenService } from "./services/csrf/buildCsrfToken.service"
import { LogoutService } from "./services/sessions/logout.service"
import { GetSessionStateByAgentService } from "./services/sessions/getSessionStateByAgent.service"
import { DatabaseModule } from "../database/database.module"
import { User } from "./entities/user.entity"
import { SessionState } from "./entities/sessionState.entity"
import { PasswordResetToken } from "./entities/passwordResetToken.entity"
import { PasswordResetRequestService } from "./services/identity/passwordResetRequest.service"
import { PasswordResetConfirmService } from "./services/identity/passwordResetConfirm.service"
import { AuthCookieInterceptor } from "./interceptors/authCookie.interceptor"
import { ClearAuthCookiesInterceptor } from "./interceptors/clearAuthCookie.interceptor"
import { RevokeAllSessionStatesForUserService } from "./services/sessions/revokeAllSessionStatesForUser.service"
import { RevokeSessionStateService } from "./services/sessions/revokeSessionState.service"
import { GetSessionStateByIdService } from "./services/sessions/getSessionStateById.service"
import { AccountLockoutService } from "./services/credentials/accountLockout.service"
import { LoginService } from "./services/sessions/login.service"
import { CreateUserService } from "./services/users/createUser.service"
import { GetUserByEmailService } from "./services/users/getUserByEmail.service"
import { GetUserByIdService } from "./services/users/getUserById.service"
import { UpdateUserService } from "./services/users/updateUser.service"
import { BuildRefreshTokenCookieService } from "./services/cookies/buildRefreshTokenCookie.service"
import { EmailVerificationToken } from "./entities"
import { RegisterUserService } from "./services/identity/registerUser.service"
import { VerifyEmailService } from "./services/identity/verifyEmail.service"
import { EmailService } from "./services/email.service"

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
      SessionState,
      PasswordResetToken,
      EmailVerificationToken
    ]),
  ],
  controllers: [AuthController, RefreshTokenController],
  providers: [
    BuildCsrfCookieService,
    BuildRefreshTokenCookieService,
    AccountLockoutService,
    AuthenticateService,
    BuildCsrfTokenService,
    VerifyCsrfTokenService,
    PasswordResetConfirmService,
    PasswordResetRequestService,
    RegisterUserService,
    VerifyEmailService,
    FindOrCreateSessionStateService,
    GetSessionStateByAgentService,
    GetSessionStateByIdService,
    LoginService,
    LogoutService,
    RefreshSessionService,
    RevokeAllSessionStatesForUserService,
    RevokeSessionStateService,
    BuildAccessTokenService,
    BuildRefreshTokenService,
    CreateUserService,
    GetUserByEmailService,
    GetUserByIdService,
    UpdateUserService,
    EmailService,
    AuthCookieInterceptor,
    ClearAuthCookiesInterceptor,
  ],
  exports: [BuildAccessTokenService, JwtModule]
})
export class AuthModule {}
