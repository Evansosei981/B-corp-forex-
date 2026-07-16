import { AppHeader } from '@/components/app-header'
import { LessonViewer } from '@/components/lesson-viewer'

export default function LessonPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="min-h-dvh">
      <AppHeader active="My Lessons" />
      <LessonViewer courseId={params.courseId} />
    </div>
  )
}
