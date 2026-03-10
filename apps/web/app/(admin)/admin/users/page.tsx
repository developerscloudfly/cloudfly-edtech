import { Users, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">User Management</h1>
          <p className="text-slate text-sm mt-1">View, search, and manage all platform users.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-ash rounded-lg text-sm bg-surface focus:outline-none focus:border-blue-primary"
          />
        </div>
        <select className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate focus:outline-none focus:border-blue-primary">
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <Users className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No users found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
