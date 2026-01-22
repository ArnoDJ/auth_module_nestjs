import type { CSSProperties } from "react"

export function DashboardPage() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.7)]"
      style={
        {
          "--dash-ink": "#0f172a",
          "--dash-accent": "#0f766e",
          "--dash-amber": "#f59e0b",
          "--dash-sand": "#f4efe6",
        } as CSSProperties
      }
    >
      <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />

      <section className="dash-fade relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#f4efe6,#e7f5f2)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600">
              Finance Module
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[color:var(--dash-ink)]">
              Pulse of your portfolio
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Track cashflow, staffing balance, and delivery risk at a glance.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/80 p-4">
                <p className="text-xs text-slate-500">Net cash</p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--dash-ink)]">
                  € 1.24M
                </p>
                <span className="text-xs text-emerald-600">+8.2% this month</span>
              </div>
              <div className="rounded-xl bg-white/80 p-4">
                <p className="text-xs text-slate-500">Burn rate</p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--dash-ink)]">
                  € 82k
                </p>
                <span className="text-xs text-amber-600">High alert</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Forecast</h2>
              <span className="text-xs text-slate-500">Next 6 weeks</span>
            </div>
            <div className="mt-6 flex h-40 items-end gap-2">
              {["35", "50", "44", "68", "52", "80"].map((height, index) => (
                <div
                  key={height}
                  className="flex-1 rounded-lg bg-[linear-gradient(180deg,#0f766e,#0ea5a4)]"
                  style={{
                    height: `${height}%`,
                    opacity: 0.8 + index * 0.03,
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
              <span>W5</span>
              <span>W6</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="dash-fade relative z-10 mt-8"
        style={{ animationDelay: "120ms" }}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Projects
            </p>
            <p className="mt-3 text-2xl font-semibold text-[color:var(--dash-ink)]">
              12 active
            </p>
            <p className="mt-2 text-sm text-slate-600">
              3 are at risk of running over budget.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Employees
            </p>
            <p className="mt-3 text-2xl font-semibold text-[color:var(--dash-ink)]">
              84 onboard
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Utilization steady at 78% this week.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#134e4a)] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Focus
            </p>
            <p className="mt-3 text-2xl font-semibold">
              Improve margin
            </p>
            <p className="mt-2 text-sm text-white/70">
              Review staffing ratios on priority accounts.
            </p>
            <button className="mt-4 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              Open plan
            </button>
          </div>
        </div>
      </section>

      <section
        className="dash-fade relative z-10 mt-8"
        style={{ animationDelay: "220ms" }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Cash allocation
            </h3>
            <div className="mt-5 space-y-4">
              {[
                { label: "R&D", value: "36%", color: "bg-teal-600" },
                { label: "Operations", value: "28%", color: "bg-amber-500" },
                { label: "Payroll", value: "24%", color: "bg-slate-700" },
                { label: "Reserve", value: "12%", color: "bg-emerald-600" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Today
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center justify-between rounded-xl bg-[color:var(--dash-sand)] px-4 py-3">
                <span>Invoice batch</span>
                <span className="text-xs font-semibold text-[color:var(--dash-ink)]">
                  14:00
                </span>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span>Payroll sync</span>
                <span className="text-xs font-semibold text-[color:var(--dash-ink)]">
                  16:30
                </span>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span>Risk review</span>
                <span className="text-xs font-semibold text-[color:var(--dash-ink)]">
                  17:15
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
