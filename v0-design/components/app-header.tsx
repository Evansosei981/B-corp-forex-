import Link from 'next/link'
import { Bell, Search, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

const nav = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'My Lessons', href: '/lesson' },
]

export function AppHeader({ active = 'Dashboard' }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="B Corp Forex home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  item.label === active
                    ? 'text-sm font-medium text-foreground'
                    : 'text-sm text-muted-foreground transition-colors hover:text-foreground'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="ml-1 hidden sm:inline-flex"
          >
            <Settings />
            Profile Settings
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <LogOut />
          </Button>
          <div className="ml-1 flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            MW
          </div>
        </div>
      </div>
    </header>
  )
}
