import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createHmac, randomBytes } from "crypto"

@Injectable()
export class BuildCsrfTokenService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  public execute(refreshTokenStateId: string): string {
    const nonce = randomBytes(32).toString("hex")
    const expiresAt = this.getExpiresAt()

    const hmac = this.sign(nonce, expiresAt, refreshTokenStateId)

    return `v1.${nonce}.${expiresAt}.${refreshTokenStateId}.${hmac}`
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

  private getExpiresAt(): number {
    const ttl =
      this.configService.get<number>("CSRF_TOKEN_TTL") ??
      60 * 60 * 24

    return Math.floor(Date.now() / 1000) + ttl
  }

  private getSecret(): string {
    const secret = this.configService.get<string>("CSRF_SECRET")
    if (!secret) {
      throw new Error("CSRF_SECRET is not configured")
    }
    return secret
  }

}
