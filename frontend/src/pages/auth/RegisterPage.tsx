import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterCredentials } from '../../utils/types';
import { authService } from '../../services/auth.service';
import { FlashlightGrid } from '@/components/ui/flashlight-grid';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Logo } from '@/components/logo';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setError('');
      await authService.register(data);
      
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');
      
      navigate(redirectUrl || '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Brand Panel (Left) */}
      <div className="relative hidden flex-col items-center justify-center border-r border-border lg:flex">
        <FlashlightGrid />
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <Link to="/" className="mb-8 hover:opacity-80 transition-opacity">
            <Logo className="h-16 w-auto" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Master the Markets.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-md">
            Join thousands of traders consistently passing evaluations and securing funded capital.
          </p>
        </div>
      </div>

      {/* Auth Panel (Right) */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-[450px]">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <SpotlightCard className="p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Create an account</h2>
              <p className="text-sm text-muted-foreground">Join B CORP and master the markets.</p>
            </div>
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-6 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">First name</label>
                  <input 
                    {...register('firstName')}
                    type="text" 
                    className={`w-full bg-secondary border ${errors.firstName ? 'border-destructive' : 'border-border'} rounded-md px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Last name</label>
                  <input 
                    {...register('lastName')}
                    type="text" 
                    className={`w-full bg-secondary border ${errors.lastName ? 'border-destructive' : 'border-border'} rounded-md px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                <input 
                  {...register('email')}
                  type="email" 
                  className={`w-full bg-secondary border ${errors.email ? 'border-destructive' : 'border-border'} rounded-md px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input 
                  {...register('password')}
                  type="password" 
                  className={`w-full bg-secondary border ${errors.password ? 'border-destructive' : 'border-border'} rounded-md px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`}
                  placeholder="••••••••"
                />
                {errors.password ? (
                  <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters long.</p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-bold py-2.5 px-4 rounded-md transition-opacity mt-4 text-sm"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </SpotlightCard>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:opacity-80">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
