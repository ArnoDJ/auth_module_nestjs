import { http } from "./http"

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await http.post<{ accessToken: string }>(
      "/auth/login",
      { email, password }
    )
    return data.accessToken
  },

  async logout() {
    await http.post("/auth/logout")
  },

  async me() {
    const { data } = await http.get("/auth/me")
    return data
  },

  async requestPasswordReset(email: string) {
    await http.post("/auth/password-reset/request", { email })
  },

  async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirmation: string
  }) {
    await http.post("/auth/register", data)
  },
}
