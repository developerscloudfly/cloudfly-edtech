import { Radio, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InstructorLivePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">Live Sessions</h1>
          <p className="text-slate text-sm mt-1">Schedule and manage live classes.</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Schedule Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Upcoming', value: '0', icon: Calendar, color: 'text-blue-primary' },
          { label: 'Live Now', value: '0', icon: Radio, color: 'text-red-500' },
          { label: 'Completed', value: '0', icon: Radio, color: 'text-green-600' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <Icon className={`w-8 h-8 ${s.color}`} />
                <div>
                  <p className="font-heading text-2xl font-bold text-blue-deep">{s.value}</p>
                  <p className="text-xs text-slate">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Session Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <Radio className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No sessions scheduled</p>
            <p className="text-sm mt-1">Click "Schedule Session" to create your first live class.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
