import { SessionState } from "../modules/auth/entities"

export function createSessionStateMock(
  overrides: Partial<SessionState> = {},
): SessionState {
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
