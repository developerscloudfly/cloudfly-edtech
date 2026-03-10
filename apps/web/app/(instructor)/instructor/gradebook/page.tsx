import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GradebookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">Gradebook</h1>
        <p className="text-slate text-sm mt-1">View quiz scores and overall student progress.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Student Grades</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No grade data yet</p>
            <p className="text-sm mt-1">Grades will appear here once students complete quizzes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
