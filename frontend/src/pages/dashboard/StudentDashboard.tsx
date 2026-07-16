import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Award, ArrowRight, Clock, PlayCircle } from 'lucide-react';
import type { AuthResponse, Course } from '../../utils/types';
import { api } from '../../services/api';
import { AppHeader } from '@/components/app-header';
import { Button, buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function StudentDashboard() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [progressSummary, setProgressSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const fetchDashboardData = async () => {
      try {
        const [enrollRes, progressRes] = await Promise.all([
          api.get('/courses/my-enrollments'),
          api.get('/progress/summary')
        ]);
        setEnrolledCourses(enrollRes.data);
        setProgressSummary(progressRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

  if (!user) return null;

  const totalCompletedLessons = progressSummary.reduce((acc, curr) => acc + curr.completedLessons, 0);
  const totalCertificates = progressSummary.filter(p => p.isCertified).length;

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length.toString(), icon: BookOpen },
    { label: 'Lessons Completed', value: totalCompletedLessons.toString(), icon: CheckCircle2 },
    { label: 'Certificates Earned', value: totalCertificates.toString(), icon: Award },
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <AppHeader active="Dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 flex-1 w-full">
        {/* Welcome */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
          </div>
          <Link to="/catalog" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Browse Catalog
            <ArrowRight />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Active courses */}
        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Continue learning
          </h2>
          <Link
            to="/catalog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>

        {loading ? (
           <div className="mt-5 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>
        ) : enrolledCourses.length === 0 ? (
           <div className="mt-5 bg-card border border-border rounded-xl p-12 text-center max-w-2xl mx-auto">
             <h3 className="text-lg font-bold mb-2">No courses yet</h3>
             <p className="text-muted-foreground mb-8">You haven't enrolled in any courses. Browse our catalog to find the perfect trading strategy for you.</p>
             <Link to="/catalog" className={buttonVariants()}>
                Explore Courses
             </Link>
           </div>
        ) : (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enrolledCourses.map((course) => {
              const summary = progressSummary.find(p => p.courseId === course.id);
              const percentage = summary ? summary.percentage : 0;

              return (
                <div key={course.id} className="flex flex-col gap-2">
                  <Link
                    to={`/learn/${course.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40 flex-1"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-card/50 opacity-40 grayscale blur-[1px]">
                          <Logo className="scale-125 opacity-80" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <PlayCircle className="size-11 text-primary" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        Self-paced
                      </div>
                      <h3 className="mt-2 text-pretty font-semibold leading-snug group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-primary">
                            {percentage}%
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                  {summary?.isCertified && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 text-success border-success/30 hover:bg-success/10 hover:text-success"
                      onClick={() => alert(`Generating certificate for ${course.title}...`)}
                    >
                      <Award className="mr-2 size-4" /> Download Certificate
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  )
}
