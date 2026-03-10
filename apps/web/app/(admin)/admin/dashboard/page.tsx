import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Total Users', value: '0', icon: Users, color: 'text-blue-primary', bg: 'bg-blue-primary/10', change: '+0%' },
  { label: 'Total Courses', value: '0', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-500/10', change: '+0%' },
  { label: 'Total Revenue', value: '$0', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-accent/10', change: '+0%' },
  { label: 'Enrollments', value: '0', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-500/10', change: '+0%' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">Admin Dashboard</h1>
        <p className="text-slate text-sm mt-1">Platform overview and key metrics.</p>
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
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-slate">{stat.label}</p>
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Registrations</CardTitle></CardHeader>
          <CardContent>
            <p className="text-center py-8 text-slate text-sm">No new registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
          <CardContent>
            <p className="text-center py-8 text-slate text-sm">No recent payments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
