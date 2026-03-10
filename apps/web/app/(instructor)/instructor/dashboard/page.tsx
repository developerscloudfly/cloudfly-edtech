import { auth } from '@/lib/auth';
import { BookOpen, Users, DollarSign, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
  { label: 'Active Courses', value: '0', icon: BookOpen, color: 'text-blue-primary', bg: 'bg-blue-primary/10' },
  { label: 'Total Students', value: '0', icon: Users, color: 'text-green-600', bg: 'bg-green-500/10' },
  { label: 'Total Revenue', value: '$0', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-accent/10' },
  { label: 'Avg. Rating', value: '—', icon: Star, color: 'text-purple-600', bg: 'bg-purple-500/10' },
];

export default async function InstructorDashboard() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">
            Instructor Dashboard
          </h1>
          <p className="text-slate text-sm mt-1">Manage your courses and students.</p>
        </div>
        <Button asChild>
          <Link href="/instructor/courses">Create Course</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="font-heading text-2xl font-bold text-blue-deep">{stat.value}</p>
                <p className="text-xs text-slate mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <p className="font-medium">No activity yet</p>
            <p className="text-sm mt-1">Create your first course to get started.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
