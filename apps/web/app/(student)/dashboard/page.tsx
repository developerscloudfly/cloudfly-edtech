import { auth } from '@/lib/auth';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Enrolled Courses', value: '0', icon: BookOpen, color: 'text-blue-primary', bg: 'bg-blue-primary/10' },
  { label: 'Hours Learned', value: '0', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-accent/10' },
  { label: 'Certificates', value: '0', icon: Award, color: 'text-green-600', bg: 'bg-green-500/10' },
  { label: 'Avg. Progress', value: '0%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-500/10' },
];

export default async function StudentDashboard() {
  const session = await auth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">
          Welcome back, {session?.user?.name?.split(' ')[0] ?? 'Student'} 👋
        </h1>
        <p className="text-slate text-sm mt-1">Track your learning progress and continue where you left off.</p>
      </div>

      {/* Stats */}
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

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No courses enrolled yet</p>
            <p className="text-sm mt-1">Browse our catalog and start your learning journey.</p>
            <a href="/courses" className="inline-block mt-4 text-sm text-blue-primary font-medium hover:text-blue-deep">
              Browse courses →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
