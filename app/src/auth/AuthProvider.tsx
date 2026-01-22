import { authApi } from "../api/auth.api"
import { AuthContext } from "./authContext"
import { setAccessToken } from "../api/http"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = null
  const isLoading = false

  async function login(email: string, password: string) {
    const accessToken = await authApi.login(email, password)
    setAccessToken(accessToken)
  }

  async function logout() {
    await authApi.logout()
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading: isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
