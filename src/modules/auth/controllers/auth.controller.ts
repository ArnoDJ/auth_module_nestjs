import {
  Controller,
  Post,
  Body,
  HttpCode,
  Headers,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger"
import { AuthenticationDto } from "../dto/authentication.dto"
import { AuthenticationResultDto } from "../dto/authenticationResult.dto"
import { LogoutService } from "../services/logout.service"
import { CurrentUser } from "../../../decorators/currentUser.decorator"
import { JwtGuard } from "../guards/jwtGuard"
import { User } from "../entities/user"
import { LoginService } from "../services/authentication/login.service"
import { AuthCookieInterceptor } from "../interceptors/authCookie.interceptor"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
  ) {}

  @ApiOperation({ description: "authenticates a user with email and password" })
  @ApiOkResponse({
    description: "user successfully authenticated",
    type: AuthenticationResultDto,
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @UseInterceptors(AuthCookieInterceptor)
  @Post("/login")
  @HttpCode(200)
  public async create(
    @Body() userData: AuthenticationDto,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthenticationResultDto> {
    return await this.loginService.execute(
      userData,
      userAgent ?? "unknown",
    )
  }

  @ApiOperation({ description: "logs a user out by revoking his/her access token" })
  @ApiOkResponse({
    description: "user successfully logged out",
  })
  @UseGuards(JwtGuard)
  @Post("/logout")
  @HttpCode(200)
  public async logout(
    @CurrentUser() currentUser: User,
    @Headers("user-agent") userAgent?: string,
  ): Promise<void> {
    await this.logoutService.execute(
      currentUser.id,
      userAgent ?? "unknown",
    )
  }
}
