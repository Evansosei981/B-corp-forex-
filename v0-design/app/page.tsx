import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Infinity as InfinityIcon,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const features = [
  {
    icon: GraduationCap,
    title: 'Expert Mentorship',
    description:
      'Learn directly from full-time traders with a decade of verified track record across FX and indices.',
  },
  {
    icon: LineChart,
    title: 'Proven Strategies',
    description:
      'Rules-based systems for price action, risk, and psychology — no vague theory, just repeatable edges.',
  },
  {
    icon: InfinityIcon,
    title: 'Lifetime Access',
    description:
      'Buy once and keep every future update, new module, and live session recording forever.',
  },
]

const stats = [
  { value: '12,400+', label: 'Active students' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '38', label: 'Expert-led courses' },
  { value: '92%', label: 'Completion rate' },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
          />
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="flex size-1.5 rounded-full bg-primary" />
                New: 2026 Institutional Order Flow module
              </span>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Master the Markets with{' '}
                <span className="text-primary">Precision</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                A premium Forex education platform that turns raw ambition into a
                disciplined, repeatable trading process. Real strategies, real
                mentorship, real results.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Button size="lg" className="h-11 px-6 text-sm" nativeButton={false} render={<Link href="/catalog" />}>
                  Start Learning
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 text-sm"
                  nativeButton={false}
                  render={<Link href="/lesson" />}
                >
                  Watch a lesson
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                Rated 4.9 by 12,400+ traders
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative mx-auto mt-16 max-w-5xl">
              <div className="glow-gold overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-1.5 border-b border-border bg-secondary/40 px-4 py-3">
                  <span className="size-3 rounded-full bg-muted-foreground/30" />
                  <span className="size-3 rounded-full bg-muted-foreground/30" />
                  <span className="size-3 rounded-full bg-muted-foreground/30" />
                  <span className="ml-3 text-xs text-muted-foreground">
                    B Corp Forex — Live Trading Terminal
                  </span>
                </div>
                <Image
                  src="/images/trading-dashboard.png"
                  alt="B Corp Forex trading dashboard showing a candlestick chart and analytics"
                  width={1280}
                  height={720}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border/60 bg-card/30">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2 py-8 text-center">
                <p className="text-3xl font-semibold tracking-tight text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Why B Corp Forex</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to trade like a professional
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              We stripped away the noise and built a curriculum around the three
              pillars that actually move the needle.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]"
            />
            <div className="relative">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3.5 text-primary" />
                Join 12,400+ funded and independent traders
              </div>
              <h2 className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Your trading edge starts today
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
                Get lifetime access to every course, mentorship session, and
                future update for a single one-time investment.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="h-11 px-6 text-sm" nativeButton={false} render={<Link href="/catalog" />}>
                  Browse Courses
                  <ArrowRight />
                </Button>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" /> 30-day
                    guarantee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-primary" /> Private community
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
