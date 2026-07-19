import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, PlayCircle, Lock, ChevronDown, Circle, Check, ArrowLeft, Video } from 'lucide-react';
import { api } from '../../services/api';
import type { Course } from '../../utils/types';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Lesson {
  id: number;
  title: string;
  meetingUrl: string;
  content: string;
  orderIndex: number;
}

interface Module {
  id: number;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [openModules, setOpenModules] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        const modulesRes = await api.get(`/courses/${id}/modules`);
        const modulesData = await Promise.all(
          modulesRes.data.map(async (mod: any) => {
            const lessonsRes = await api.get(`/courses/modules/${mod.id}/lessons`);
            return { ...mod, lessons: lessonsRes.data };
          })
        );
        
        setModules(modulesData);
        setOpenModules(modulesData.map((_, i) => i)); // Open all by default

        const progressRes = await api.get(`/progress/course/${id}`);
        setCompletedLessonIds(progressRes.data);
        
        // Auto-select first lesson if available
        if (modulesData.length > 0 && modulesData[0].lessons.length > 0) {
          setActiveLesson(modulesData[0].lessons[0]);
        }
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  const toggleModule = (i: number) => {
    setOpenModules(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const handleMarkComplete = async () => {
    if (!activeLesson || completedLessonIds.includes(activeLesson.id)) return;
    
    try {
      setMarkingComplete(true);
      await api.post(`/progress/${activeLesson.id}`);
      setCompletedLessonIds(prev => [...prev, activeLesson.id]);
    } catch (err) {
      console.error(err);
      alert('Failed to mark lesson as complete.');
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center bg-background">Loading...</div>;
  if (!course) return <div className="min-h-dvh flex items-center justify-center bg-background">Course not found.</div>;

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader active="My Lessons" />
      <div className="mx-auto flex w-full max-w-7xl flex-col-reverse gap-6 px-4 py-6 sm:px-6 lg:flex-row flex-1">
        {/* Sidebar — curriculum */}
        <aside className="w-full shrink-0 lg:w-[30%] lg:max-w-sm">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5">
              <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Link>
              <h2 className="mt-1 font-semibold text-lg line-clamp-2">{course.title}</h2>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{completedLessonIds.length} of {totalLessons} complete</span>
                <span className="font-medium text-primary">{progressPercentage}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
            <div className="p-2 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {modules.map((mod, i) => (
                <div key={mod.id} className="mb-1">
                  <button
                    type="button"
                    onClick={() => toggleModule(i)}
                    aria-expanded={openModules.includes(i)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary/50"
                  >
                    Module {mod.orderIndex + 1}: {mod.title}
                    <ChevronDown
                      className={cn(
                        'size-4 shrink-0 text-muted-foreground transition-transform',
                        openModules.includes(i) && 'rotate-180',
                      )}
                    />
                  </button>
                  {openModules.includes(i) && (
                    <ul className="mt-1 space-y-0.5 pb-1">
                      {mod.lessons.map((lesson) => {
                        const isActive = activeLesson?.id === lesson.id;
                        const isCompleted = completedLessonIds.includes(lesson.id);
                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveLesson(lesson);
                              }}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                                isActive
                                  ? 'border border-primary/30 bg-primary/10 text-foreground font-medium'
                                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="size-4 shrink-0 text-success" />
                              ) : isActive ? (
                                <PlayCircle className="size-4 shrink-0 fill-primary text-primary" />
                              ) : (
                                <Circle className="size-4 shrink-0 opacity-50" />
                              )}
                              <span className="flex-1 leading-snug line-clamp-2">
                                {lesson.title}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main — video + notes */}
        <div className="min-w-0 flex-1">
          {activeLesson ? (
            <>
              {activeLesson.meetingUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-background to-secondary shadow-lg group p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <Video className="size-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 tracking-tight">Live Class Session</h2>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Join the instructor and other students in the live meeting room.
                  </p>
                  <a 
                    href={activeLesson.meetingUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xl shadow-primary/25"
                  >
                    Join Live Class
                  </a>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg group p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <Lock className="size-12 text-muted-foreground mb-4 opacity-50" />
                  <h2 className="text-xl font-medium mb-2">Class Locked</h2>
                  <p className="text-muted-foreground">
                    Enroll in the course to access the live meeting link.
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {activeLesson.title}
                  </h1>
                </div>
                <Button
                  size="lg"
                  variant={completedLessonIds.includes(activeLesson.id) ? 'outline' : 'default'}
                  className="h-11 shrink-0 px-5"
                  onClick={handleMarkComplete}
                  disabled={markingComplete || completedLessonIds.includes(activeLesson.id)}
                >
                  {completedLessonIds.includes(activeLesson.id) ? (
                    <>
                      <Check className="text-success" />
                      <span className="text-success">Completed</span>
                    </>
                  ) : (
                    <>{markingComplete ? 'Marking...' : 'Mark as Complete'}</>
                  )}
                </Button>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-sm font-semibold">Instructor Notes</h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <div className="whitespace-pre-wrap">
                    {activeLesson.content || 'No notes provided for this class.'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <PlayCircle className="size-12 mx-auto mb-4 opacity-50" />
                <p>Select a class from the sidebar to start learning.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
