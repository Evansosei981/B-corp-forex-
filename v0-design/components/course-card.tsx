'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Course } from '@/lib/data'

export function CourseCard({ course }: { course: Course }) {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.image || '/placeholder.svg'}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-background"
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              wishlisted && 'fill-primary text-primary',
            )}
          />
        </button>
        <span className="absolute left-3 top-3 rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur-md">
          {course.level}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-pretty font-semibold leading-snug">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <p className="text-xl font-semibold text-primary">${course.price}</p>
          <Button size="lg">
            Enroll Now
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
