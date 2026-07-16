import Link from 'next/link'
import { Logo } from '@/components/logo'

const groups = [
  {
    title: 'Platform',
    links: ['Courses', 'Mentorship', 'Community', 'Live Sessions'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Blog'],
  },
  {
    title: 'Legal',
    links: ['Terms', 'Privacy', 'Risk Disclosure', 'Refunds'],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Premium Forex education built for traders who take the markets
              seriously. Learn the systems used by professionals.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © 2026 B Corp Forex. Trading involves substantial risk of loss.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for serious traders.
          </p>
        </div>
      </div>
    </footer>
  )
}
