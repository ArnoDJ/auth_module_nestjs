import { useState } from "react"
import { useTranslation } from "react-i18next"
import { authApi } from "../api/auth.api"

export function PasswordForgetPage() {
  const { t } = useTranslation()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await authApi.requestPasswordReset(email)

      // Always show success, even if email doesn't exist (security)
      setSuccess(true)
    } catch {
      setError(t("forgot.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4 text-center">
          {t("forgot.title")}
        </h1>

        <p className="text-sm text-slate-600 mb-6 text-center">
          {t("forgot.description")}
        </p>

        {success ? (
          <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 text-center">
            {t("forgot.success")}
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("forgot.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? t("forgot.loading")
                  : t("forgot.submit")}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm text-slate-600">
          <a href="/login" className="text-blue-600 hover:underline">
            {t("forgot.back")}
          </a>
        </div>
      </div>
    </div>
  )
}
