import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { Response } from "express"
import { BuildCookieWithRefreshTokenService } from "../services/cookies/buildCookieWithRefreshToken.service"
import { BuildCookieWithCsrfTokenService } from "../services/cookies/buildCookieWithCsrfToken.service"

type LoginResponseWithSecrets = {
  accessToken: string
  refreshToken: string
  csrfToken: string
}

type LoginResponse = {
  accessToken: string
}

@Injectable()
export class AuthCookieInterceptor
  implements NestInterceptor<LoginResponseWithSecrets, LoginResponse>
{
  constructor(
    private readonly buildCookieWithRefreshTokenService: BuildCookieWithRefreshTokenService,
    private readonly buildCookieWithCsrfTokenService: BuildCookieWithCsrfTokenService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<LoginResponseWithSecrets>,
  ): Observable<LoginResponse> {
    const res = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      tap((result) => {
        const refreshCookie =
          this.buildCookieWithRefreshTokenService.execute(result.refreshToken)

        const csrfCookie =
          this.buildCookieWithCsrfTokenService.execute(result.csrfToken)

        res.setHeader("Set-Cookie", [refreshCookie, csrfCookie])

        // Never expose secrets in response body
        delete (result as Partial<LoginResponseWithSecrets>).refreshToken
        delete (result as Partial<LoginResponseWithSecrets>).csrfToken
      }),
    )
  }
}
