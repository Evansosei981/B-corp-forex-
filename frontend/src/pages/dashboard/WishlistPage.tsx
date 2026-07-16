import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Course } from '../../utils/types';
import { AppHeader } from '@/components/app-header';
import { CourseCard } from '@/components/course-card';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wishlistRes, enrollmentsRes, paymentsRes] = await Promise.all([
          api.get('/wishlists'),
          api.get('/courses/my-enrollments'),
          api.get('/payments/me')
        ]);
        setCourses(wishlistRes.data);
        setWishlistIds(new Set(wishlistRes.data.map((c: any) => c.id)));
        setEnrolledIds(new Set(enrollmentsRes.data.map((c: any) => c.id)));
        setPendingIds(new Set(paymentsRes.data.filter((p: any) => p.status === 'PENDING').map((p: any) => p.course.id)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleWishlist = async (courseId: number) => {
    try {
      await api.post(`/wishlists/${courseId}/toggle`);
      setWishlistIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
      // Remove from the local courses list so it disappears instantly
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center bg-background">Loading...</div>;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader active="Wishlist" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 flex-1">
        
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Wishlist</h1>
          <p className="mt-2 text-muted-foreground">Courses you have saved for later.</p>
        </div>

        {courses.length === 0 ? (
          <div className="mt-8 bg-card border border-border rounded-xl p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-8">Save courses you're interested in by clicking the heart icon in the catalog.</p>
            <Link to="/catalog" className={buttonVariants()}>
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
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
                      <Link to={`/checkout/${course.id}`} className={buttonVariants({ size: "lg" })}>
                        Unlock Course <ArrowRight />
                      </Link>
                    )
                  }
                />
              )
            })}
          </div>
        )}

      </div>
    </div>
  );
}
