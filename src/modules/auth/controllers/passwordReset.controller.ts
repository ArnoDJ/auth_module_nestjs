import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Param
} from "@nestjs/common"
import { Response } from "express"
import {
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiProperty
} from "@nestjs/swagger"
import { PasswordResetService } from "../services/passwordReset.service"
import { PasswordResetRequestDto } from "../dto/authentication.dto"
import { ChangePasswordDto } from "../dto/changePassword.dto"
import { ChangePasswordService } from "../services/changePassword.service"

@ApiTags("Auth")
@Controller("auth/password-reset")
export class PasswordResetController {
  constructor(
    private readonly passwordResetService: PasswordResetService,
    private readonly changePasswordService: ChangePasswordService,
  ) {}

  @ApiOperation({ description: "requests a password reset" })
  @ApiBadRequestResponse({ description: "user with email does not exist" })
  @Post("/request")
  @HttpCode(200)
  public async reset(
    @Body() passwordResetRequestData: PasswordResetRequestDto,
  ): Promise<void> {
    await this.passwordResetService.execute(passwordResetRequestData.email)
  }

  @ApiProperty({ description: "sets a new password" })
  @ApiBadRequestResponse({ description: "link expired"})
  @Post("/:token")
  public async change(
    @Param("id") id: string,
    @Body() changePasswordDate: ChangePasswordDto,
  ): Promise<void> {
    await this.changePasswordService.execute(changePasswordDate, id)
  }
}
