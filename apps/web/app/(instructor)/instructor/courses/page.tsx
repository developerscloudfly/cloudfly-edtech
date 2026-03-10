import { BookOpen, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InstructorCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">My Courses</h1>
          <p className="text-slate text-sm mt-1">Create and manage your course content.</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> New Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Published Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No courses yet</p>
            <p className="text-sm mt-1">Click "New Course" to create your first course.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
