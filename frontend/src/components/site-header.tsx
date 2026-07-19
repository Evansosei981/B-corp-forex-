import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { motion, useScroll, useTransform } from 'framer-motion'

const links = [
  { label: 'Courses', href: '/catalog' },
  { label: 'Curriculum', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
]

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Make the background transparent at the top, and glassmorphism when scrolled
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(11, 14, 17, 0)', 'rgba(11, 14, 17, 0.9)']
  )
  
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(43, 49, 57, 0)', 'rgba(43, 49, 57, 1)']
  )

  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(16px)']
  )

  return (
    <motion.header 
      style={{ backgroundColor, borderColor, backdropFilter: backdropBlur }}
      className="fixed top-0 left-0 right-0 z-50 border-b"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
          <Link to="/" aria-label="B Corp Forex home">
            <Logo />
          </Link>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            link.href.includes('#') ? (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className={buttonVariants({ variant: "ghost", size: "lg", className: "hidden text-muted-foreground hover:text-foreground sm:inline-flex" })}
          >
            Sign In
          </Link>
          <Link to="/register" className={buttonVariants({ size: "lg", className: "h-9 px-4 sm:h-11 sm:px-8 text-xs sm:text-sm" })}>
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border/60 shadow-lg px-4 py-6 space-y-4 z-40 animate-fade-in-up">
          <nav className="flex flex-col space-y-3">
            {links.map((link) => (
              link.href.includes('#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg transition-colors text-foreground font-medium hover:bg-secondary/50"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg transition-colors text-foreground font-medium hover:bg-secondary/50"
                >
                  {link.label}
                </Link>
              )
            ))}
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg transition-colors text-primary font-medium hover:bg-secondary/50 sm:hidden mt-2 border border-primary/20 bg-primary/10 text-center"
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </motion.header>
  )
}
