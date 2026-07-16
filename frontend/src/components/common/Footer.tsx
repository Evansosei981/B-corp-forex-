import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter text-foreground block mb-4">
              B<span className="text-gold-500">CORP</span>
            </Link>
            <p className="text-foreground-muted text-sm leading-relaxed">
              Master the markets with professional Forex trading strategies. Elevate your skills and financial future.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/catalog" className="text-foreground-muted hover:text-gold-500 transition-colors">Courses</Link></li>
              <li><Link to="/dashboard" className="text-foreground-muted hover:text-gold-500 transition-colors">Dashboard</Link></li>
              <li><Link to="/login" className="text-foreground-muted hover:text-gold-500 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><span className="text-foreground-muted hover:text-gold-500 transition-colors cursor-pointer" onClick={() => alert('FAQ coming soon!')}>FAQ</span></li>
              <li><span className="text-foreground-muted hover:text-gold-500 transition-colors cursor-pointer" onClick={() => alert('Contact form coming soon!')}>Contact Us</span></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><span className="text-foreground-muted hover:text-gold-500 transition-colors cursor-pointer" onClick={() => alert('Terms of Service coming soon!')}>Terms of Service</span></li>
              <li><span className="text-foreground-muted hover:text-gold-500 transition-colors cursor-pointer" onClick={() => alert('Privacy Policy coming soon!')}>Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground-muted">
          <p>© {new Date().getFullYear()} B CORP FOREX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
