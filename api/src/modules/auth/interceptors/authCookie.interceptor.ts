import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Response } from "express"
import { BuildCsrfCookieService } from "../services/cookies/buildCsrfCookie.service"
import { BuildRefreshTokenCookieService } from "../services/cookies/buildRefreshTokenCookie.service"
import { LoginInternalResult } from "../types/loginInternalResult"

type LoginHttpResponse = {
  accessToken: string
}

@Injectable()
export class AuthCookieInterceptor
  implements NestInterceptor<LoginInternalResult, LoginHttpResponse>
{
  constructor(
    private readonly buildRefreshTokenCookieService: BuildRefreshTokenCookieService,
    private readonly buildCsrfCookieService: BuildCsrfCookieService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<LoginInternalResult>,
  ): Observable<LoginHttpResponse> {
    const res = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((result) => {
        // IMPORTANT: these are already STRINGS
        const refreshCookie =
          this.buildRefreshTokenCookieService.execute(result.refreshToken)

        const csrfCookie =
          this.buildCsrfCookieService.execute(result.csrfToken)

        res.setHeader("Set-Cookie", [refreshCookie, csrfCookie])

        return {
          accessToken: result.accessToken,
        }
      }),
    )
  }
}
