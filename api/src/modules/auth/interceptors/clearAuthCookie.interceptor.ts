import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { Response } from "express"

@Injectable()
export class ClearAuthCookiesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<void> {
    const res = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      tap(() => {
        res.setHeader("Set-Cookie", [
          "refreshToken=; Path=/auth/refresh_token; HttpOnly; Secure; SameSite=None; Max-Age=0",
          "_csrf=; Path=/; Secure; SameSite=None; Max-Age=0",
        ])
      }),
    )
  }
}
