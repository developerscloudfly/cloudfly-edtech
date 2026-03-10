import { CourseCard } from './CourseCard';
import type { CourseDTO } from '@/types';

interface CourseGridProps {
  courses: CourseDTO[];
  emptyMessage?: string;
}

export function CourseGrid({ courses, emptyMessage = 'No courses found.' }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 text-slate">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
