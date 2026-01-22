import {
  Controller,
  Post,
  Body,
  HttpCode,
  Headers,
  UseGuards,
  UseInterceptors
} from "@nestjs/common"
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger"
import { AuthenticationDto } from "../dto/authentication.dto"
import { AuthenticationResultDto } from "../dto/authenticationResult.dto"
import { LogoutService } from "../services/sessions/logout.service"
import { CurrentUser } from "../../../decorators/currentUser.decorator"
import { JwtGuard } from "../guards/jwtGuard"
import { User } from "../entities/user.entity"
import { LoginService } from "../services/sessions/login.service"
import { AuthCookieInterceptor } from "../interceptors/authCookie.interceptor"
import { ClearAuthCookiesInterceptor } from "../interceptors/clearAuthCookie.interceptor"
import { CreateUserDto, UserDto } from "../dto/user.dto"
import { RegisterUserService } from "../services/identity/registerUser.service"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly registerUserService: RegisterUserService,
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

  @ApiOperation({ description: "logs a user out" })
  @ApiOkResponse({ description: "user successfully logged out" })
  @UseGuards(JwtGuard)
  @UseInterceptors(ClearAuthCookiesInterceptor)
  @Post("/logout")
  @HttpCode(204)
  public async logout(
    @CurrentUser() currentUser: User,
    @Headers("user-agent") userAgent?: string,
  ): Promise<void> {
    await this.logoutService.execute(
      currentUser.id,
      userAgent ?? "unknown",
    )
  }

  @ApiOperation({ description: "creates a user account" })
  @ApiOkResponse({ description: "user successfully created" })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @Post("/register")
  @HttpCode(201)
  public async register(
    @Body() userData: CreateUserDto,
  ): Promise<void> {
    await this.registerUserService.execute(userData)
  }

}
