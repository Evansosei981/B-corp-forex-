import { Link } from 'react-router-dom'
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
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { buttonVariants } from '@/components/ui/button'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { motion } from 'framer-motion'

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
  { value: 12400, label: 'Active students', suffix: '+' },
  { value: 4.9, label: 'Average rating', suffix: '/5' },
  { value: 38, label: 'Expert-led courses', suffix: '' },
  { value: 92, label: 'Completion rate', suffix: '%' },
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
            className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] animate-breathe"
          />
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground animate-fade-in-up">
                <span className="flex size-1.5 rounded-full bg-primary" />
                New: 2026 Institutional Order Flow module
              </span>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl animate-fade-in-up [animation-delay:150ms]">
                Master the Markets with{' '}
                <span className="text-primary text-gradient-gold animate-text-shimmer">Precision</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg animate-fade-in-up [animation-delay:300ms]">
                A premium Forex education platform that turns raw ambition into a
                disciplined, repeatable trading process. Real strategies, real
                mentorship, real results.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row animate-fade-in-up [animation-delay:450ms]">
                <Link to="/register" className={buttonVariants({ size: "lg", className: "h-11 px-6 text-sm w-full sm:w-auto group" })}>
                  Get Started
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6 text-sm w-full sm:w-auto" })}
                >
                  Sign In
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground animate-fade-in-up [animation-delay:600ms]">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                Rated 4.9 by 12,400+ traders
              </div>
            </div>

            {/* Dashboard mockup */}
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative mx-auto mt-16 max-w-5xl animate-scale-in [animation-delay:750ms]"
            >
              {/* Glowing Aura behind mockup */}
              <div className="absolute inset-0 -m-8 rounded-full bg-primary/20 blur-[100px] animate-breathe pointer-events-none" />
              
              <div className="glow-gold overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-1.5 border-b border-border/50 bg-secondary/20 px-4 py-3 backdrop-blur-sm">
                  <span className="size-3 rounded-full bg-muted-foreground/30" />
                  <span className="size-3 rounded-full bg-muted-foreground/30" />
                  <span className="size-3 rounded-full bg-muted-foreground/30" />
                  <span className="ml-3 text-xs text-muted-foreground">
                    B Corp Forex — Live Trading Terminal
                  </span>
                </div>
                <img
                  src="/images/trading-dashboard.png"
                  alt="B Corp Forex trading dashboard showing a candlestick chart and analytics"
                  className="h-auto w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border/60 bg-card/30 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2 py-8 text-center">
                <p className="text-3xl font-semibold tracking-tight text-primary">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 scroll-mt-24">
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
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-7 backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <AnimatedSection id="pricing" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 scroll-mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] animate-breathe"
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
                <Link to="/catalog" className={buttonVariants({ size: "lg", className: "h-11 px-6 text-sm w-full sm:w-auto group" })}>
                  Browse Courses
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
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
        </AnimatedSection>
      </main>
      <SiteFooter />
    </div>
  )
}
