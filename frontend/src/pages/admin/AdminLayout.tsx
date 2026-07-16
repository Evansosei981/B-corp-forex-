import { useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path 
      ? "bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 font-semibold" 
      : "text-foreground-muted hover:text-foreground hover:bg-surface-hover border-l-2 border-transparent font-medium";
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans selection:bg-gold-500/30 overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-border absolute w-full z-40">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gold-500 rounded-sm flex items-center justify-center font-bold text-background text-xs mr-3">B</div>
          <span className="font-bold text-sm tracking-tight text-foreground uppercase">Admin Portal</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-foreground-muted hover:text-foreground"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-border">
          <div className="w-6 h-6 bg-gold-500 rounded-sm flex items-center justify-center font-bold text-background text-xs mr-3">B</div>
          <span className="font-bold text-sm tracking-tight text-foreground uppercase">Admin Portal</span>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin" className={`block px-6 py-2.5 transition-colors text-sm ${isActive('/admin')}`}>Overview</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/courses" className={`block px-6 py-2.5 transition-colors text-sm ${isActive('/admin/courses')}`}>Courses</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/payments" className={`block px-6 py-2.5 transition-colors text-sm ${isActive('/admin/payments')}`}>Payments</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/students" className={`block px-6 py-2.5 transition-colors text-sm ${isActive('/admin/students')}`}>Students</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/settings" className={`block px-6 py-2.5 transition-colors text-sm ${isActive('/admin/settings')}`}>Settings</Link>
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground-muted hover:text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-background md:pt-0 pt-16">
        <Outlet />
      </div>
    </div>
  );
}
