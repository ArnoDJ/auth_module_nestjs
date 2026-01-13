import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Param
} from "@nestjs/common"
import {
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiProperty
} from "@nestjs/swagger"
import { PasswordResetRequestService } from "../services/identity/passwordResetRequest.service"
import { PasswordResetRequestDto } from "../dto/authentication.dto"
import { ChangePasswordDto } from "../dto/changePassword.dto"
import { PasswordResetConfirmService } from "../services/identity/passwordResetConfirm.service"

@ApiTags("Auth")
@Controller("auth/password-reset")
export class PasswordResetController {
  constructor(
    private readonly passwordResetRequestService: PasswordResetRequestService,
    private readonly passwordResetConfirmService: PasswordResetConfirmService,
  ) {}

  @ApiOperation({ description: "requests a password reset" })
  @ApiBadRequestResponse({ description: "user with email does not exist" })
  @Post("/request")
  @HttpCode(200)
  public async reset(
    @Body() passwordResetRequestData: PasswordResetRequestDto,
  ): Promise<void> {
    await this.passwordResetRequestService.execute(passwordResetRequestData.email)
  }

  @ApiProperty({ description: "sets a new password" })
  @ApiBadRequestResponse({ description: "link expired"})
  @Post("/:token")
  public async change(
    @Param("id") id: string,
    @Body() changePasswordDate: ChangePasswordDto,
  ): Promise<void> {
    await this.passwordResetConfirmService.execute(changePasswordDate, id)
  }
}
