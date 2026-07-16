import { useState } from 'react';

interface CourseImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export default function CourseImage({ src, alt, className = "", fallbackText = "B CORP FOREX" }: CourseImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-background border border-border text-foreground-muted font-medium tracking-widest text-xs uppercase overflow-hidden ${className}`}>
        {fallbackText}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={() => setError(true)}
      className={`object-cover ${className}`}
    />
  );
}
