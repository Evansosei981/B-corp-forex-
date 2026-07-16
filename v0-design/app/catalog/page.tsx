'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { CourseCard } from '@/components/course-card'
import type { Course } from '@/lib/types'
import { api } from '@/lib/api'

const filters = ['All Courses', 'Beginner', 'Intermediate', 'Advanced', 'Free Lessons']

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // We attempt to fetch courses. If backend is down, we handle error.
        const res = await api.get('/courses')
        setCourses(res.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load courses from backend.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="min-h-dvh">
      <AppHeader active="Catalog" />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Course Catalog
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Professional-grade Forex courses built by full-time traders.
            Enroll once, own the knowledge forever.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search courses..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-3 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, i) => (
              <button
                key={filter}
                type="button"
                className={
                  i === 0
                    ? 'rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary'
                    : 'rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {loading ? (
            <p className="text-muted-foreground">Loading courses...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-muted-foreground">No courses available.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
