import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">Analytics</h1>
        <p className="text-slate text-sm mt-1">Platform metrics, revenue, and growth insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 text-ash" />
              <p className="text-sm">Revenue chart will appear once you have payment data.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Enrollment Trends</CardTitle></CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 text-ash" />
              <p className="text-sm">Enrollment chart will appear once you have data.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
