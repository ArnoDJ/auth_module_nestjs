import { ApiProperty } from "@nestjs/swagger"

export class AuthenticationResultDto {
  @ApiProperty()
  public refreshToken: string

  @ApiProperty()
  public accessToken: string

  @ApiProperty()
  public csrfToken: string
}
