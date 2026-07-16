import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import type { Course } from '../../utils/types';
import { AppHeader } from '@/components/app-header';
import { SiteHeader } from '@/components/site-header';
import { CourseCard } from '@/components/course-card';
import { Button, buttonVariants } from '@/components/ui/button';

const filters = ['All Courses', 'Beginner', 'Intermediate', 'Advanced', 'Free Lessons'];

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Courses');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);

        if (localStorage.getItem('user')) {
          const [enrollmentsRes, paymentsRes, wishlistRes] = await Promise.all([
            api.get('/courses/my-enrollments'),
            api.get('/payments/me'),
            api.get('/wishlists')
          ]);
          setEnrolledIds(new Set(enrollmentsRes.data.map((c: any) => c.id)));
          setPendingIds(new Set(paymentsRes.data.filter((p: any) => p.status === 'PENDING').map((p: any) => p.course.id)));
          setWishlistIds(new Set(wishlistRes.data.map((c: any) => c.id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleToggleWishlist = async (courseId: number) => {
    if (!localStorage.getItem('user')) {
      alert("Please login to save courses to your wishlist.");
      return;
    }
    
    try {
      await api.post(`/wishlists/${courseId}/toggle`);
      setWishlistIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(courseId)) {
          newSet.delete(courseId);
        } else {
          newSet.add(courseId);
        }
        return newSet;
      });
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeFilter === 'All Courses') return true;
    if (activeFilter === 'Free Lessons') return c.price === 0;
    
    return c.difficultyLevel === activeFilter;
  });

  return (
    <div className="min-h-dvh flex flex-col">
      {localStorage.getItem('user') ? <AppHeader active="Catalog" /> : <SiteHeader />}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 flex-1 w-full">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-3 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={
                  activeFilter === filter
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
        {loading ? (
           <div className="mt-12 text-center text-muted-foreground animate-pulse">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
           <div className="mt-12 text-center text-muted-foreground bg-card border border-border rounded-xl p-12">
             No courses found.
           </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const isFree = course.price === 0;
              const isLocked = !isFree && !enrolledIds.has(course.id!);
              return (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  isLocked={isLocked}
                  isWishlisted={wishlistIds.has(course.id!)}
                  onToggleWishlist={handleToggleWishlist}
                  actionButton={
                    !isLocked ? (
                      <Link to={`/learn/${course.id}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
                        {isFree && !enrolledIds.has(course.id!) ? "Start for Free" : "Go to Course"}
                      </Link>
                    ) : pendingIds.has(course.id!) ? (
                      <Button size="lg" disabled variant="secondary">
                        Payment Pending
                      </Button>
                    ) : (
                      <Link to={localStorage.getItem('user') ? `/checkout/${course.id}` : `/login?redirect=/checkout/${course.id}`} className={buttonVariants({ size: "lg" })}>
                        Unlock Course <ArrowRight />
                      </Link>
                    )
                  }
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
