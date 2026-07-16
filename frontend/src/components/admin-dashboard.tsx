'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  MoreHorizontal,
  Search,
  TrendingUp,
  DollarSign,
  UserPlus,
  ArrowUpRight,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { students, payments } from '@/lib/data'

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Courses', icon: BookOpen },
  { label: 'Students', icon: Users },
  { label: 'Payments', icon: CreditCard },
]

const metrics = [
  { label: 'Total Revenue', value: '$284,910', delta: '+12.4%', icon: DollarSign },
  { label: 'Active Students', value: '12,483', delta: '+4.1%', icon: Users },
  { label: 'New Enrollments', value: '318', delta: '+18.7%', icon: UserPlus },
  { label: 'Conversion', value: '6.9%', delta: '+0.8%', icon: TrendingUp },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Approved:
      'bg-[oklch(0.72_0.16_150_/_0.12)] text-[oklch(0.8_0.16_150)] ring-[oklch(0.72_0.16_150_/_0.25)]',
    Pending:
      'bg-warning/12 text-warning ring-warning/25',
    Suspended:
      'bg-destructive/12 text-destructive ring-destructive/25',
    Refunded:
      'bg-destructive/12 text-destructive ring-destructive/25',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        styles[status] ?? 'bg-secondary text-muted-foreground ring-border',
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function ActionsMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        aria-label="Row actions"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-32 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-xl">
          <button className="block w-full px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-secondary">
            Edit
          </button>
          <button className="block w-full px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export function AdminDashboard() {
  const [active, setActive] = useState('Overview')
  const showPayments = active === 'Payments'

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-border/60 px-6">
          <Link to="/" aria-label="B Corp Forex home">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active === item.label
                  ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border/60 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              AB
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Admin</p>
              <p className="truncate text-xs text-muted-foreground">
                admin@bcorp.fx
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{active}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Manage your platform and monitor performance
            </p>
          </div>
          <div className="relative hidden w-full max-w-xs sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-3 focus:ring-primary/20"
            />
          </div>
        </header>

        <main className="flex-1 space-y-8 p-4 sm:p-6">
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                    <metric.icon className="size-4" />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-[oklch(0.8_0.16_150)]">
                    <ArrowUpRight className="size-3.5" />
                    {metric.delta}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">
                  {showPayments ? 'Recent Payments' : 'Students'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {showPayments
                    ? 'Latest transactions across the platform'
                    : 'All registered students and their status'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showPayments ? 'ghost' : 'secondary'}
                  size="sm"
                  onClick={() => setActive('Students')}
                >
                  Students
                </Button>
                <Button
                  variant={showPayments ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActive('Payments')}
                >
                  Payments
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {showPayments ? (
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Invoice</th>
                      <th className="px-5 py-3 font-medium">Student</th>
                      <th className="px-5 py-3 font-medium">Course</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border/60 last:border-0 transition-colors hover:bg-secondary/30"
                      >
                        <td className="px-5 py-4 font-medium tabular-nums">
                          {p.id}
                        </td>
                        <td className="px-5 py-4">{p.student}</td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {p.course}
                        </td>
                        <td className="px-5 py-4 font-medium tabular-nums text-primary">
                          ${p.amount}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-5 py-4">
                          <ActionsMenu />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Courses</th>
                      <th className="px-5 py-3 font-medium">Joined</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-border/60 last:border-0 transition-colors hover:bg-secondary/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                              {s.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <span className="font-medium">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {s.email}
                        </td>
                        <td className="px-5 py-4 tabular-nums">{s.courses}</td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {s.joined}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="px-5 py-4">
                          <ActionsMenu />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
