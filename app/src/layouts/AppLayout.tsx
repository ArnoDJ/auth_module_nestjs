import { useMemo, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../auth/useAuth"

export function AppLayout() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const displayName = useMemo(() => {
    const first = user?.firstName?.trim()
    const last = user?.lastName?.trim()
    if (first || last) {
      return [first, last].filter(Boolean).join(" ")
    }
    if (!user?.email) {
      return "Account"
    }
    return user.email.split("@")[0] || "Account"
  }, [user?.email, user?.firstName, user?.lastName])
  const initials = useMemo(() => {
    const firstInitial = user?.firstName?.trim().charAt(0) ?? ""
    const lastInitial = user?.lastName?.trim().charAt(0) ?? ""
    const fallback = displayName.slice(0, 2)
    const combined = `${firstInitial}${lastInitial}`.trim()
    return (combined || fallback).toUpperCase()
  }, [displayName, user?.firstName, user?.lastName])

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 lg:flex-row">
      <aside className="w-full bg-slate-950 text-white border-b border-white/10 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/20 text-white/80 transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="flex flex-col items-center justify-center gap-1">
              <span className="h-0.5 w-5 rounded-full bg-white/80" />
              <span className="h-0.5 w-5 rounded-full bg-white/80" />
              <span className="h-0.5 w-5 rounded-full bg-white/80" />
            </span>
          </button>
          <NavLink to="/" className="block text-lg font-semibold tracking-wide">
            Easify Finance
          </NavLink>
          <div className="relative ml-auto lg:hidden">
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-xs text-white/80 transition hover:bg-white/10"
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
                {initials}
              </span>
              <span className="hidden sm:block font-semibold text-white">
                {displayName}
              </span>
              <span className="hidden sm:block">
                <svg
                  className={`ml-1.5 h-5 w-5 shrink-0 transition-transform ${
                    isProfileOpen ? "-rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/70"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900 p-2 text-sm shadow-xl transition ${
                isProfileOpen ? "opacity-100" : "pointer-events-none opacity-0"
              } z-50`}
            >
              <NavLink
                to="/profile"
                className="block cursor-pointer rounded-lg px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  logout()
                }}
                className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${
            isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <nav
          className={`fixed left-0 top-16 z-50 h-[calc(100%-4rem)] w-64 bg-slate-950 px-4 pb-6 pt-6 text-sm shadow-2xl transition-transform duration-200 lg:static lg:h-auto lg:w-auto lg:px-6 lg:pb-6 lg:pt-0 lg:shadow-none ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
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
        <header className="hidden items-center justify-between px-6 py-4 bg-white/70 backdrop-blur border-b border-slate-200 lg:flex lg:relative lg:z-40">
          <span className="text-sm text-slate-700">
            {user?.email}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                {initials}
              </span>
              <span className="font-semibold">{displayName}</span>
              <span className="hidden sm:block">
                <svg
                  className={`ml-1.5 h-5 w-5 shrink-0 transition-transform ${
                    isProfileOpen ? "-rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-500"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl transition ${
                isProfileOpen ? "opacity-100" : "pointer-events-none opacity-0"
              } z-[60]`}
            >
              <NavLink
                to="/profile"
                className="block cursor-pointer rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
                onClick={() => setIsProfileOpen(false)}
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  logout()
                }}
                className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
