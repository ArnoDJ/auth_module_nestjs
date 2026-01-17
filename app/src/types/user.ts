export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  admin: boolean
  failedLoginAttempts: number
  lockedUntil: Date

}
