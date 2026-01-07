import {
  Controller,
  Post,
  UsePipes,
  Inject,
  Res,
  HttpCode,
  ValidationPipe,
  Req,
  UnauthorizedException,
  UseGuards,
  Headers,
  UseInterceptors
} from "@nestjs/common"
import { Response } from "express"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse
} from "@nestjs/swagger"
import { Request } from "express"
import { RefreshTokenService } from "../services/refreshToken.service"
import { BuildCookieWithCsrfTokenService } from "../services/cookies/buildCookieWithCsrfToken.service"
import { BuildCsrfTokenService } from "../services/buildCsrfToken.service"
import { CsrfGuard } from "../guards/csrfGuard"
import { AuthenticationResultDto } from "../dto/authenticationResult.dto"
import { AuthCookieInterceptor } from "../interceptors/authCookie.interceptor"

@ApiTags("Auth")
@Controller("auth")
@UseGuards(CsrfGuard)
export class RefreshTokenController {
  constructor(
    @Inject(RefreshTokenService)
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(BuildCookieWithCsrfTokenService)
    private readonly buildCsrfCookieService: BuildCookieWithCsrfTokenService,
    @Inject(BuildCsrfTokenService)
    private readonly buildCsrfTokenService: BuildCsrfTokenService
  ) {}

  @ApiOperation({ description: "refresh access token" })
  @ApiOkResponse({
    description: "successfully refreshed access token",
    type: AuthenticationResultDto
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UseInterceptors(AuthCookieInterceptor)
  @Post("/refresh_token")
  @HttpCode(200)
  public async create(
    @Res() response: Response,
    @Req() request: Request,
    @Headers("user-agent") userAgent?: string
  ): Promise<Response<AuthenticationResultDto>> {
    const refreshTokenFromRequest = this.getRefreshTokenFromCookie(request)
    if (!refreshTokenFromRequest) {
      throw new UnauthorizedException("not allowed")
    }
    const { refreshToken, accessToken, cookie } =
      await this.refreshTokenService.execute(refreshTokenFromRequest, userAgent ?? "unknown")
    const csrfCookie = this.buildCsrfCookie()
    response.setHeader("Set-Cookie", [cookie, csrfCookie])
    return response.send({ accessToken, refreshToken })
  }

  private getRefreshTokenFromCookie(request: Request): string | undefined {
    const cookies: { refreshToken?: string } = request.cookies as {
      refreshToken?: string
    }
    return cookies["refreshToken"]
  }

  private buildCsrfCookie(): string {
    const csrfCookie = this.buildCsrfTokenService.execute()
    return this.buildCsrfCookieService.execute(csrfCookie)
  }
}
