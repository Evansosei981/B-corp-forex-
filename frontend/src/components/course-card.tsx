'use client'

import { useState } from 'react'
import { Heart, ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import type { Course } from '@/utils/types'

export function CourseCard({ 
  course, 
  onToggleWishlist, 
  isWishlisted, 
  actionButton,
  isLocked = false
}: { 
  course: Course, 
  onToggleWishlist?: (id: number) => void, 
  isWishlisted?: boolean, 
  actionButton?: React.ReactNode,
  isLocked?: boolean 
}) {
  const [wishlisted, setWishlisted] = useState(isWishlisted || false)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted(!wishlisted);
    if (onToggleWishlist) onToggleWishlist(course.id!);
  }

  return (
    <div className={cn(
      "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 h-full relative",
      isLocked 
        ? "border-border/50 bg-card/50" 
        : "border-border hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
    )}>
      {isLocked && (
        <div className="absolute inset-0 z-20" aria-hidden="true" />
      )}

      {/* Thumbnail Container (Strict 16:9) */}
      <div className="relative aspect-video overflow-hidden bg-card/50 flex items-center justify-center border-b border-border/50 shrink-0">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className={cn(
              "object-cover w-full h-full transition-transform duration-500",
              !isLocked && "group-hover:scale-105",
              isLocked && "opacity-40 grayscale blur-[2px]"
            )}
          />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center transition-transform duration-500",
            !isLocked && "group-hover:scale-105",
            isLocked && "opacity-40 grayscale blur-[2px]"
          )}>
            <Logo className="scale-125 opacity-80" />
          </div>
        )}

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/20 backdrop-blur-sm">
            <div className="flex size-14 items-center justify-center rounded-full bg-background/80 shadow-lg border border-border">
              <Lock className="size-6 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={isLocked}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            "absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-md transition-colors",
            !isLocked && "hover:bg-background",
            isLocked && "opacity-50 cursor-not-allowed"
          )}
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              wishlisted && !isLocked && 'fill-primary text-primary',
            )}
          />
        </button>

        {/* Category Badge */}
        <span className={cn(
          "absolute left-3 top-3 z-10 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md",
          isLocked 
            ? "bg-background/40 border-border/50 text-muted-foreground/70"
            : "bg-background/80 border-border text-foreground shadow-sm"
        )}>
          Beginner
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={cn(
          "text-pretty font-semibold leading-snug text-lg",
          isLocked && "text-muted-foreground"
        )}>
          {course.title}
        </h3>
        <p className={cn(
          "mt-2 line-clamp-2 text-sm leading-relaxed",
          isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
        )}>
          {course.description}
        </p>

        {/* Spacer to push content down if needed */}
        <div className="flex-1" />

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5 mt-auto">
          {isLocked ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-0.5">Enrollment Fee</span>
              <p className="text-2xl font-black tracking-tighter text-foreground drop-shadow-sm">
                ${course.price}
              </p>
            </div>
          ) : course.price === 0 ? (
            <p className="text-xl font-semibold text-success">
              FREE
            </p>
          ) : (
            <p className="text-sm font-semibold text-gold-500 uppercase tracking-widest">
              Purchased
            </p>
          )}
          
          {/* Action Button */}
          {actionButton ? (
            <div className="relative z-30 w-full flex justify-end">
              {actionButton}
            </div>
          ) : isLocked ? (
            <Button size="lg" disabled variant="secondary" className="relative z-30">
              Upgrade to Unlock
            </Button>
          ) : (
            <Button size="lg">
              Enroll Now
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
