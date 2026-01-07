import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsNumber } from "class-validator"

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @ApiProperty()
  @IsBoolean()
  public admin: boolean

  @ApiProperty()
  public createdAt: Date

  @ApiProperty()
  public updatedAt: Date
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public passwordConfirmation: string
}

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public lastName: string
}

export class UsersInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @ApiProperty()
  @IsBoolean()
  public admin: boolean

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public birdCount: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public profilePicture: string
}
