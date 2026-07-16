import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in to your account.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data || 'Verification failed. The token may be expired or invalid.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[450px]">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center text-background text-sm">B</div>
            CORP
          </Link>
        </div>

        <div className="bg-surface border border-border p-8 rounded-xl shadow-xl text-center">
          {status === 'loading' && (
            <div className="py-6">
              <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-foreground mb-2">Verifying your email...</h3>
              <p className="text-foreground-muted">Please wait while we verify your token.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Email Verified!</h3>
              <p className="text-foreground-muted mb-6">{message}</p>
              <Link 
                to="/login" 
                className="inline-block bg-gold-500 hover:bg-gold-400 text-background font-semibold py-2.5 px-6 rounded-lg transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-6">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Verification Failed</h3>
              <p className="text-foreground-muted mb-6">{message}</p>
              <Link to="/register" className="text-gold-500 font-medium hover:text-gold-400 block mb-2">
                Register a new account
              </Link>
              <Link to="/" className="text-foreground-muted hover:text-foreground">
                Return to home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
