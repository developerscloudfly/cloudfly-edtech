'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStats(res.data);
        else setError(res.error ?? 'Failed to load stats');
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Total Users',
      value: loading ? null : String(stats?.totalUsers ?? 0),
      icon: Users,
      color: 'text-blue-primary',
      bg: 'bg-blue-primary/10',
    },
    {
      label: 'Total Courses',
      value: loading ? null : String(stats?.totalCourses ?? 0),
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Total Revenue',
      value: loading
        ? null
        : (stats?.totalRevenue ?? 0) > 0
        ? `₹${(stats!.totalRevenue / 100).toLocaleString('en-IN')}`
        : '$0',
      icon: DollarSign,
      color: 'text-yellow-600',
      bg: 'bg-yellow-accent/10',
    },
    {
      label: 'Enrollments',
      value: loading ? null : String(stats?.totalEnrollments ?? 0),
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">Admin Dashboard</h1>
        <p className="text-slate text-sm mt-1">Platform overview and key metrics.</p>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-7 bg-ash/40 rounded w-16" />
                    <div className="h-3 bg-ash/30 rounded w-24" />
                  </div>
                ) : (
                  <>
                    <p className="font-heading text-2xl font-bold text-blue-deep">{card.value}</p>
                    <p className="text-xs text-slate mt-0.5">{card.label}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-slate text-sm">No new registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-slate text-sm">No recent payments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
