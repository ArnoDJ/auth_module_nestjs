import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../auth/useAuth"

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-950 text-white p-6 border-r border-white/10">
        <NavLink to="/" className="block text-lg font-semibold tracking-wide mb-8">
          Easify Finance
        </NavLink>

        <nav className="space-y-2 text-sm">
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-folder-open text-xs" aria-hidden="true" />
              Projects
            </span>
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-user-group text-xs" aria-hidden="true" />
              Employees
            </span>
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur border-b border-slate-200">
          <span className="text-sm text-slate-700">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            Logout
          </button>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
