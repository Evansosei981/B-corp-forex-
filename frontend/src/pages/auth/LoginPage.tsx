import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginCredentials } from '../../utils/types';
import { authService } from '../../services/auth.service';

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError('');
      const response = await authService.login(data);
      
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');

      if (response.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectUrl || '/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center text-background text-sm">B</div>
            CORP
          </Link>
        </div>

        <div className="bg-surface border border-border p-8 rounded-xl shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Welcome back</h2>
            <p className="text-sm text-foreground-muted">Sign in to your account to continue</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input 
                {...register('email')}
                type="email" 
                className={`w-full bg-background border ${errors.email ? 'border-red-500' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder-foreground-muted/50 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-gold-500 hover:text-gold-400">Forgot password?</Link>
              </div>
              <input 
                {...register('password')}
                type="password" 
                className={`w-full bg-background border ${errors.password ? 'border-red-500' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder-foreground-muted/50 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-background font-semibold py-2.5 px-4 rounded-lg transition-colors mt-2 text-sm"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-foreground-muted">
          Don't have an account? <Link to="/register" className="text-gold-500 font-medium hover:text-gold-400">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
