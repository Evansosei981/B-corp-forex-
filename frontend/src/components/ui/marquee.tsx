import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Marquee({ children, className = "" }: MarqueeProps) {
  return (
    <div className={`flex w-full overflow-hidden ${className}`}>
      <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-10 py-4">
        {children}
      </div>
      <div
        className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-10 py-4"
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
