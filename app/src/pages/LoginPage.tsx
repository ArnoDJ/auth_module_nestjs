import { useState } from "react"
import { useAuth } from "../auth/useAuth"
import { useTranslation } from "react-i18next"

export function LoginPage() {
  const { login, loading } = useAuth()
  const { t } = useTranslation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      await login(email, password)
    } catch {
      setError(t("login.error"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
          {t("login.title")}
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("login.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("login.password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <a href="/password-forget" className="text-blue-600 hover:underline">
            {t("login.forgot")}
          </a>
        </div>
      </div>
    </div>
  )
}
