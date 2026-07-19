import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, PlayCircle, Lock, BookOpen, ChevronDown, Play, Pause, Circle, Check, ArrowLeft, Volume2, VolumeX, Maximize } from 'lucide-react';
import { api } from '../../services/api';
import type { Course } from '../../utils/types';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
          setIsPlaying(false);
          setPlayed(0);
          setVideoEnded(false);
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

  const getVideoUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Fallback if backend returned a relative path
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8080';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !videoEnded) {
      const progress = videoRef.current.currentTime / videoRef.current.duration;
      setPlayed(progress || 0);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setPlayed(newValue);
    if (videoRef.current) {
      videoRef.current.currentTime = newValue * videoRef.current.duration;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
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
                                setIsPlaying(false);
                                setPlayed(0);
                                setVideoEnded(false);
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
                                <Play className="size-4 shrink-0 fill-primary text-primary" />
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
              <div ref={containerRef} className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black shadow-lg group">
                <video
                  ref={videoRef}
                  src={getVideoUrl(activeLesson.videoUrl)}
                  className="absolute inset-0 w-full h-full object-contain"
                  controls
                  controlsList="nodownload"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => {
                    setIsPlaying(false);
                    setVideoEnded(true);
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Solid Black Cover for Lesson Completed */}
                {videoEnded && (
                  <div className="absolute inset-0 bg-black z-40 flex items-center justify-center flex-col gap-4">
                    <CheckCircle2 className="size-16 text-success" />
                    <p className="text-white font-medium">Lesson Completed!</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => {
                        setPlayed(0);
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          videoRef.current.play();
                        }
                        setVideoEnded(false);
                        setIsPlaying(true);
                      }}
                    >
                      Watch Again
                    </Button>
                  </div>
                )}
              </div>

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
                  <p>
                    Watch the video carefully and take notes. This lesson covers critical concepts required for the upcoming modules. Make sure you fully understand the mechanics before proceeding to the next video.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Play className="size-12 mx-auto mb-4 opacity-50" />
                <p>Select a lesson from the sidebar to start learning.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
