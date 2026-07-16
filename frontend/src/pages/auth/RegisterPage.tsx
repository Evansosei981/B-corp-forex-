import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterCredentials } from '../../utils/types';
import { authService } from '../../services/auth.service';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setError('');
      await authService.register(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

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

        <div className="bg-surface border border-border p-8 rounded-xl shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Create an account</h2>
            <p className="text-sm text-foreground-muted">Join B CORP and master the markets.</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Check your email</h3>
              <p className="text-foreground-muted mb-6">
                We've sent a verification link to your email address. Please click the link to activate your account.
              </p>
              <Link to="/login" className="text-gold-500 font-medium hover:text-gold-400">
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">First name</label>
                <input 
                  {...register('firstName')}
                  type="text" 
                  className={`w-full bg-background border ${errors.firstName ? 'border-red-500' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder-foreground-muted/50 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Last name</label>
                <input 
                  {...register('lastName')}
                  type="text" 
                  className={`w-full bg-background border ${errors.lastName ? 'border-red-500' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder-foreground-muted/50 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

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
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input 
                {...register('password')}
                type="password" 
                className={`w-full bg-background border ${errors.password ? 'border-red-500' : 'border-border'} rounded-lg px-4 py-2.5 text-foreground placeholder-foreground-muted/50 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all text-sm`}
                placeholder="••••••••"
              />
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              ) : (
                <p className="text-xs text-foreground-muted mt-1">Must be at least 6 characters long.</p>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-background font-semibold py-2.5 px-4 rounded-lg transition-colors mt-2 text-sm"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-foreground-muted">
          Already have an account? <Link to="/login" className="text-gold-500 font-medium hover:text-gold-400">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
