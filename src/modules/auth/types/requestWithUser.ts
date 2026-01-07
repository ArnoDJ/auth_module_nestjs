import { Request } from "express"
import { UserDto } from "../../../dto/user.dto"

export type RequestWithUser = {
  user: UserDto
} & Request
