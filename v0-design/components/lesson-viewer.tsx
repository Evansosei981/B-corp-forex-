'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  CheckCircle2,
  ChevronDown,
  Play,
  Circle,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { curriculum } from '@/lib/data'

import { useEffect } from 'react'
import { api } from '@/lib/api'

export function LessonViewer({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState<number[]>([0, 1, 2])
  const [completed, setCompleted] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, modulesRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/courses/${courseId}/modules`)
        ])
        setCourse(courseRes.data)
        setModules(modulesRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [courseId])

  const toggle = (i: number) =>
    setOpen((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    )

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading curriculum...</div>
  if (!course) return <div className="p-8 text-center text-destructive">Course not found</div>

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
      {/* Sidebar — curriculum */}
      <aside className="w-full shrink-0 lg:w-[30%] lg:max-w-sm">
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <p className="text-sm text-muted-foreground">Course</p>
            <h2 className="mt-1 font-semibold">Price Action Mastery</h2>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">3 of 8 complete</span>
              <span className="font-medium text-primary">38%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[38%] rounded-full bg-primary" />
            </div>
          </div>
          <div className="p-2">
            {curriculum.map((mod, i) => (
              <div key={mod.module} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={open.includes(i)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary/50"
                >
                  {mod.module}
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform',
                      open.includes(i) && 'rotate-180',
                    )}
                  />
                </button>
                {open.includes(i) && (
                  <ul className="mt-1 space-y-0.5 pb-1">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.title}>
                        <button
                          type="button"
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                            lesson.active
                              ? 'border border-primary/30 bg-primary/10 text-foreground'
                              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                          )}
                        >
                          {lesson.done ? (
                            <CheckCircle2 className="size-4 shrink-0 text-[oklch(0.72_0.16_150)]" />
                          ) : lesson.active ? (
                            <Play className="size-4 shrink-0 fill-primary text-primary" />
                          ) : (
                            <Circle className="size-4 shrink-0 opacity-50" />
                          )}
                          <span className="flex-1 leading-snug">
                            {lesson.title}
                          </span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main — video + notes */}
      <div className="min-w-0 flex-1">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card">
          <Image
            src="/images/trading-dashboard.png"
            alt="Lesson video preview"
            fill
            className="object-cover opacity-40"
            sizes="70vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              aria-label="Play lesson"
              className="glow-gold flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
            >
              <Play className="size-6 fill-current" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm text-primary">Module 2 · Lesson 1</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Break of Structure Entries
            </h1>
          </div>
          <Button
            size="lg"
            variant={completed ? 'outline' : 'default'}
            className="h-11 shrink-0 px-5"
            onClick={() => setCompleted((v) => !v)}
          >
            {completed ? (
              <>
                <Check />
                Completed
              </>
            ) : (
              <>Mark as Complete</>
            )}
          </Button>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Instructor Notes</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              A break of structure (BOS) confirms that the prevailing trend is
              likely to continue. In this lesson we cover how to mark swing highs
              and lows, and how to wait for a decisive close beyond structure
              before considering an entry.
            </p>
            <p>
              Focus on higher-timeframe context first. A BOS on the 15-minute
              chart carries far more weight when it aligns with the 4-hour trend.
              Always define your invalidation level before entering the trade.
            </p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Identify the most recent valid swing point</li>
              <li>Wait for a body close beyond that level</li>
              <li>Enter on the retest with a defined stop loss</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" size="lg">
            <ArrowLeft />
            Previous
          </Button>
          <Button variant="outline" size="lg">
            Next Lesson
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
