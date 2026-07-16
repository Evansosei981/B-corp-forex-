import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold-500/30">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-500 rounded-sm flex items-center justify-center font-bold text-background text-xs">B</div>
            <span className="font-bold text-xl tracking-tight text-foreground">B CORP</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-foreground-muted hover:text-foreground transition-colors">Home</Link>
            <Link to="/catalog" className="text-foreground-muted hover:text-foreground transition-colors">Courses</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors">Log In</Link>
            <Link to="/register" className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-md transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
