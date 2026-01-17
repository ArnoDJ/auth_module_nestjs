/* eslint-disable @typescript-eslint/consistent-type-definitions */

import "express"

declare module "express-serve-static-core" {
  interface Request {
    cookies: {
      _csrf?: string
      [key: string]: string | undefined
    }
  }
}
