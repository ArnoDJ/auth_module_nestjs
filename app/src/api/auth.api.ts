import { http } from "./http"

export const authApi = {
  async login(email: string, password: string) {
    await http.post("/auth/login", { email, password })
  },

  async logout() {
    await http.post("/auth/logout")
  },

  async me() {
    const { data } = await http.get("/auth/me")
    return data
  },
}
