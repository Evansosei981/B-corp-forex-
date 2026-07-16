import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { buttonVariants } from './ui/button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
            <AlertCircle className="size-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-3">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md text-balance">
            We're sorry, but an unexpected error occurred while loading this page. Our team has been notified.
          </p>
          <button
            className={buttonVariants({ variant: 'default' })}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
