import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, Settings, LogOut, LayoutDashboard, BookOpen, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

const nav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Lessons', href: '/dashboard', icon: BookOpen },
  { name: 'Catalog', href: '/catalog', icon: Search },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: BookOpen },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function AppHeader({ active = 'Dashboard' }: { active?: string }) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const fetchUser = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setUser(userData)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchUser()
    window.addEventListener('user-updated', fetchUser)
    return () => window.removeEventListener('user-updated', fetchUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <Link to="/" aria-label="B Corp Forex home">
              <Logo />
            </Link>
          </div>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={
                  item.name === active
                    ? 'text-sm font-medium text-foreground'
                    : 'text-sm text-muted-foreground transition-colors hover:text-foreground'
                }
              >
                {item.name}
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
          <button 
            onClick={() => navigate('/dashboard/settings')}
            className="ml-2 flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary hover:opacity-80 transition-opacity"
            title="Profile Settings"
          >
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              user?.firstName?.charAt(0) || 'G'
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            onClick={handleLogout}
            className="ml-1 hidden sm:inline-flex"
          >
            <LogOut />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border/60 shadow-lg px-4 py-4 space-y-3 z-40 animate-fade-in-up">
          <nav className="flex flex-col space-y-2">
            {nav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.name === active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="size-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
