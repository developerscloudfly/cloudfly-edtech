import { VideoPlayer } from '@/components/learn/VideoPlayer';
import { AutoNotes } from '@/components/learn/AutoNotes';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonPageProps {
  params: { courseId: string; lessonId: string };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = params;

  // In production: fetch lesson, verify enrollment, etc.
  const lesson = {
    title: 'Introduction to the Course',
    youtubeVideoId: 'dQw4w9WgXcQ',
    type: 'video' as const,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Lesson header */}
      <div>
        <p className="text-xs text-slate uppercase tracking-wide mb-1">Module 1</p>
        <h1 className="font-heading text-xl font-bold text-blue-deep">{lesson.title}</h1>
      </div>

      {/* Video */}
      <VideoPlayer
        videoId={lesson.youtubeVideoId}
        title={lesson.title}
        onComplete={async () => {
          'use server';
          // Mark lesson complete
        }}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm">
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Mark Complete & Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Auto Notes */}
      <AutoNotes lessonTitle={lesson.title} currentTime={0} />
    </div>
  );
}
