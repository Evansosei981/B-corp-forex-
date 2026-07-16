import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-9xl font-black text-gold-500/20">404</h1>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Page not found</h2>
        <p className="text-foreground-muted">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center bg-gold-500 hover:bg-gold-400 text-background px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
