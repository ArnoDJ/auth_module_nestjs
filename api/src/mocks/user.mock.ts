import { hash } from "bcrypt"
import { User } from "../modules/auth/entities"

export const createUserMock = async (
  overrides: Partial<User> = {},
): Promise<Partial<User>> => ({
  email: "tony@stark.com",
  firstName: "Tony",
  lastName: "Stark",
  password: await hash("IAmIronMan123!", 10),
  failedLoginAttempts: 0,
  lockedUntil: null,
  lastFailedLoginAt: null,
  admin: false,
  ...overrides,
})
