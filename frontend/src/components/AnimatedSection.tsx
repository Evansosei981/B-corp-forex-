import React from 'react';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animationClass?: string;
  delay?: number;
  triggerOnce?: boolean;
}

export function AnimatedSection({
  children,
  className,
  animationClass = 'animate-fade-in-up',
  delay = 0,
  triggerOnce = true,
  ...props
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce });

  return (
    <div
      ref={ref}
      className={cn(className, isInView ? animationClass : 'opacity-0')}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
      {...props}
    >
      {children}
    </div>
  );
}
