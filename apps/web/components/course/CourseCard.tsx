import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDuration } from '@/lib/utils';
import type { CourseDTO } from '@/types';

interface CourseCardProps {
  course: CourseDTO;
}

export function CourseCard({ course }: CourseCardProps) {
  const levelColors = {
    beginner: 'success',
    intermediate: 'accent',
    advanced: 'destructive',
  } as const;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-bg-base overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-primary/10 to-blue-deep/20">
            <BookOpen className="w-12 h-12 text-blue-primary/40" />
          </div>
        )}
        {course.isFree && (
          <div className="absolute top-2 left-2">
            <Badge variant="accent">Free</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={levelColors[course.level] ?? 'default'} className="capitalize">
            {course.level}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Tags */}
        {course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {course.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-slate bg-bg-base px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/courses/${course.slug}`}>
          <h3 className="font-heading font-semibold text-blue-deep text-base leading-snug mb-2 hover:text-blue-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-slate line-clamp-2 mb-3">{course.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(course.totalDuration)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.enrollmentCount.toLocaleString()} enrolled
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
        <div>
          {course.isFree ? (
            <span className="font-heading font-bold text-green-600 text-lg">Free</span>
          ) : (
            <span className="font-heading font-bold text-blue-deep text-lg">
              {formatCurrency(course.price)}
            </span>
          )}
        </div>
        <Button size="sm" asChild>
          <Link href={`/courses/${course.slug}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
