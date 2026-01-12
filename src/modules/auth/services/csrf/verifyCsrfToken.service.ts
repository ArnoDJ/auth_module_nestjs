import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createHmac, timingSafeEqual } from "crypto"
import { GetRefreshTokenStateByIdService } from "../getRefreshTokenStateById.service"

type ParsedCsrfToken = {
  version: "v1"
  nonce: string
  expiresAt: number
  refreshTokenStateId: string
  hash: string
}

@Injectable()
export class VerifyCsrfTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly getRefreshTokenStateByIdService: GetRefreshTokenStateByIdService,
  ) {}

  public async execute(token: string): Promise<void> {
    const parsed = this.parseAndValidateToken(token)

    this.verifyExpiresAt(parsed.expiresAt)
    this.verifyHash(parsed)

    const state =
      await this.getRefreshTokenStateByIdService.execute(
        parsed.refreshTokenStateId,
      )
    if (state.revoked) {
      throw new UnauthorizedException("not allowed")
    }
  }

  private parseAndValidateToken(token: string): ParsedCsrfToken {
    const parts = token.split(".")
    if (parts.length !== 5) {
      throw new UnauthorizedException("not allowed")
    }

    const [version, nonce, expiresRaw, stateId, hash] = parts

    const expiresAt = Number(expiresRaw)
    if (!Number.isInteger(expiresAt) || !nonce || !stateId || !hash || version !== "v1") {
      throw new UnauthorizedException("not allowed")
    }

    return {
      version: "v1",
      nonce,
      expiresAt,
      refreshTokenStateId: stateId,
      hash,
    }
  }

  private verifyExpiresAt(expiresAt: number): void {
    const now = Math.floor(Date.now() / 1000)
    if (expiresAt < now) {
      throw new UnauthorizedException("not allowed")
    }
  }

  private verifyHash(token: ParsedCsrfToken): void {
    const recreated = this.sign(
      token.nonce,
      token.expiresAt,
      token.refreshTokenStateId,
    )

    const a = Buffer.from(recreated)
    const b = Buffer.from(token.hash)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException("not allowed")
    }
  }

  private sign(
    nonce: string,
    expiresAt: number,
    refreshTokenStateId: string,
  ): string {
    const secret = this.getSecret()
    const hmac = createHmac("sha256", secret)

    hmac.update(`v1.${nonce}.${expiresAt}.${refreshTokenStateId}`)

    return hmac.digest("base64url")
  }

  private getSecret(): string {
    const secret = this.configService.get<string>("CSRF_SECRET")
    if (!secret) {
      throw new Error("CSRF_SECRET is not configured")
    }
    return secret
  }
}
