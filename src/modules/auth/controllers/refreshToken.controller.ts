import {
  Controller,
  Post,
  HttpCode,
  UnauthorizedException,
  UseGuards,
  Headers,
  UseInterceptors,
  Req,
} from "@nestjs/common"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger"
import { Request } from "express"
import { CsrfGuard } from "../guards/csrfGuard"
import { AuthCookieInterceptor } from "../interceptors/authCookie.interceptor"
import { AuthenticationResultDto } from "../dto/authenticationResult.dto"
import { RefreshSessionService } from "../services/sessions/refreshSession.service"

@ApiTags("Auth")
@Controller("auth")
@UseGuards(CsrfGuard)
export class RefreshTokenController {
  constructor(
    private readonly refreshSessionService: RefreshSessionService,
  ) {}

  @ApiOperation({ description: "refresh access token" })
  @ApiOkResponse({
    description: "successfully refreshed access token",
    type: AuthenticationResultDto,
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UseInterceptors(AuthCookieInterceptor)
  @Post("/refresh_token")
  @HttpCode(200)
  public async refresh(
    @Req() request: Request,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthenticationResultDto> {
    const refreshToken = this.getRefreshTokenFromCookie(request)
    if (!refreshToken) {
      throw new UnauthorizedException("not allowed")
    }
    return await this.refreshSessionService.execute(
      refreshToken,
      userAgent ?? "unknown",
    )
  }

  private getRefreshTokenFromCookie(request: Request): string | undefined {
    const cookies = request.cookies as { refreshToken?: string }
    return cookies.refreshToken
  }
}
