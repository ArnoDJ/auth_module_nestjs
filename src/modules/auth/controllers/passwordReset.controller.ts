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
import { PasswordResetRequestDto } from "../../../dto/authentication.dto"
import { ChangePasswordDto } from "src/dto/changePassword.dto"

@ApiTags("Auth")
@Controller("auth/password-reset")
export class PasswordResetController {
  constructor(

  ) {}

  @ApiOperation({ description: "requests a password reset" })
  @ApiBadRequestResponse({ description: "user with email does not exist" })
  @Post("/request")
  @HttpCode(200)
  public async reset(
    @Body() passwordResetRequestData: PasswordResetRequestDto,
    @Res() response: Response,
  ): Promise<any> {

  }

  @ApiProperty({ description: "sets a new password" })
  @ApiBadRequestResponse({ description: "link expired"})
  @Post("/:token")
  public async change(
    @Param("id") id: string,
    @Body() changePasswordDate: ChangePasswordDto,
  ) {}
}
