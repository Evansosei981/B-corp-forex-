import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

const links = [
  { label: 'Courses', href: '/catalog' },
  { label: 'Curriculum', href: '#features' },
  { label: 'Mentors', href: '#mentors' },
  { label: 'Pricing', href: '#pricing' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="B Corp Forex home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="lg"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            Sign In
          </Button>
          <Button size="lg" nativeButton={false} render={<Link href="/catalog" />}>
            Start Learning
          </Button>
        </div>
      </div>
    </header>
  )
}
