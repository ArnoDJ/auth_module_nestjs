import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Request } from "express"
import { timingSafeEqual } from "crypto"
import { VerifyCsrfTokenService } from "../services/csrf/verifyCsrfToken.service"

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly verifyCsrfTokenService: VerifyCsrfTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const csrfCookie = this.getCsrfTokenFromCookie(request)
    const csrfHeader = this.getCsrfTokenFromHeader(request)
    if (!csrfCookie || !csrfHeader) {
      throw new ForbiddenException("CSRF token missing")
    }

    if (!this.timingSafeEquals(csrfCookie, csrfHeader)) {
      throw new ForbiddenException("CSRF token mismatch")
    }

    await this.verifyCsrfTokenService.execute(csrfHeader)

    return true
  }

  private getCsrfTokenFromCookie(request: Request): string | null {
    const cookies = request.cookies as Record<string, unknown>
    const token = cookies["_csrf"]

    return typeof token === "string" && token.length > 0
      ? token
      : null
  }

  private getCsrfTokenFromHeader(request: Request): string | null {
    const header = request.headers["x-csrf-token"]

    return typeof header === "string" && header.length > 0
      ? header
      : null
  }

  private timingSafeEquals(a: string, b: string): boolean {
    const aBuf = Buffer.from(a)
    const bBuf = Buffer.from(b)
    if (aBuf.length !== bBuf.length) {
      return false
    }

    return timingSafeEqual(aBuf, bBuf)
  }
}
