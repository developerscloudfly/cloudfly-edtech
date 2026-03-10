import { BookOpen, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">Course Management</h1>
          <p className="text-slate text-sm mt-1">Review, publish, and manage all courses.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-9 pr-4 py-2.5 border border-ash rounded-lg text-sm bg-surface focus:outline-none focus:border-blue-primary"
          />
        </div>
        <select className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate">
          <option>All Statuses</option>
          <option>Draft</option>
          <option>Published</option>
          <option>Archived</option>
        </select>
      </div>

      <Card>
        <CardHeader><CardTitle>All Courses</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No courses yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
