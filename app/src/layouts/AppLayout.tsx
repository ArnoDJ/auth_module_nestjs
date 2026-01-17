import { Outlet } from "react-router-dom"
import { useAuth } from "../auth/useAuth"

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4">
        <div className="font-semibold mb-6">
          My App
        </div>

        <nav className="space-y-2 text-sm">
          <a href="/" className="block hover:underline">
            Dashboard
          </a>
          <a href="/projects" className="block hover:underline">
            Projects
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-100">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <span className="text-sm text-slate-700">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="text-sm text-blue-600 hover:underline"
          >
            Logout
          </button>
        </header>

        {/* Routed content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
