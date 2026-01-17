import { useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "../api/auth.api"
import { AuthContext } from "./authContext"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
  })

  async function login(email: string, password: string) {
    await authApi.login(email, password)
    await queryClient.invalidateQueries({ queryKey: ["me"] })
  }

  async function logout() {
    await authApi.logout()
    queryClient.removeQueries({ queryKey: ["me"] })
  }

  return (
    <AuthContext.Provider
      value={{ user, loading: isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
