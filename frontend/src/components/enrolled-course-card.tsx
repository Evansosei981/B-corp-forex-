import { Link } from 'react-router-dom';
import { PlayCircle, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Logo } from '@/components/logo';
import type { Course } from '@/utils/types';

interface EnrolledCourseCardProps {
  course: Course;
  percentage: number;
  isCertified: boolean;
}

export function EnrolledCourseCard({ course, percentage, isCertified }: EnrolledCourseCardProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <Link to={`/learn/${course.id}`} className="flex-1 flex w-full">
        <SpotlightCard className="group flex flex-col overflow-hidden transition-colors w-full">
          <div className="relative aspect-video overflow-hidden bg-muted border-b border-border/50 shrink-0">
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              <Clock className="size-3.5" />
              Self-paced
            </div>
            
            <h3 className="mt-2 text-pretty font-semibold leading-snug group-hover:text-primary transition-colors text-lg text-foreground">
              {course.title}
            </h3>
            
            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Link>
      
      {isCertified && (
        <Button 
          variant="outline" 
          className="w-full mt-1 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary font-semibold"
          onClick={() => alert(`Generating certificate for ${course.title}...`)}
        >
          <Award className="mr-2 size-4" /> Download Certificate
        </Button>
      )}
    </div>
  );
}
