import { ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">Project Submissions</h1>
        <p className="text-slate text-sm mt-1">Review and grade student project submissions.</p>
      </div>

      <div className="flex gap-2">
        <Badge variant="default">All</Badge>
        <Badge variant="outline">Pending</Badge>
        <Badge variant="outline">Reviewed</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Submissions</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No submissions yet</p>
            <p className="text-sm mt-1">Student submissions will appear here for review.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
