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

    return `${nonce}.${expiresAt}.${refreshTokenStateId}.${hmac}`
  }

  private sign(
    nonce: string,
    expiresAt: number,
    refreshTokenStateId: string,
  ): string {
    const secret = this.configService.get<string>("CSRF_SECRET")!
    const hmac = createHmac("sha256", secret)

    hmac.update(`${nonce}.${expiresAt}.${refreshTokenStateId}`)

    return hmac.digest("base64")
  }

  private getExpiresAt(): number {
    const ttl =
      this.configService.get<number>("CSRF_TOKEN_TTL") ??
      60 * 60 * 24 // 24h

    return Math.floor(Date.now() / 1000) + ttl
  }
}
