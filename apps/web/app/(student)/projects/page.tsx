import { FolderKanban, Plus, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">My Projects</h1>
          <p className="text-slate text-sm mt-1">Submit and track your project assignments.</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Submit Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Submitted', value: '0', icon: FolderKanban, color: 'text-blue-primary' },
          { label: 'Pending Review', value: '0', icon: Clock, color: 'text-yellow-600' },
          { label: 'Reviewed', value: '0', icon: CheckCircle, color: 'text-green-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="font-heading text-xl font-bold text-blue-deep">{stat.value}</p>
                  <p className="text-xs text-slate">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Project list */}
      <Card>
        <CardHeader>
          <CardTitle>Project Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <FolderKanban className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No projects submitted yet</p>
            <p className="text-sm mt-1">Complete a course module and submit your first project.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
