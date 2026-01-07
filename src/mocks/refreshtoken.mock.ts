import { RefreshTokenState } from "../modules/auth/entities"

export function createRefreshTokenStateMock(
  overrides: Partial<RefreshTokenState> = {},
): RefreshTokenState {
  return {
    id: "refresh-state-id",
    userId: "user-id",
    userAgent: "Mozilla/5.0",
    revoked: false,
    revokedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
