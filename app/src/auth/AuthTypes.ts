export type AuthContextValue = {
  user: unknown | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
