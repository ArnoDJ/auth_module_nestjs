export type TokenPayload = {
  sub: string
  iat: number
  exp: number
}

export type RefreshTokenJwtPayload = {
  sub: string
  sid: string
}

export type AccessTokenPayload = {
  sub: string
  admin: boolean
}
