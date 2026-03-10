import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Edit3 } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">My Profile</h1>
        <p className="text-slate text-sm mt-1">Manage your account information.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-blue-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-primary font-heading font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-blue-deep">{user?.name}</h2>
              <p className="text-slate text-sm">{user?.email}</p>
              <span className="inline-block mt-1 text-xs bg-blue-primary/10 text-blue-primary px-2 py-0.5 rounded-full capitalize font-medium">
                {user?.role}
              </span>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 py-2 border-b border-ash">
            <User className="w-4 h-4 text-slate flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate">Full Name</p>
              <p className="text-sm font-medium text-blue-deep">{user?.name ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-ash">
            <Mail className="w-4 h-4 text-slate flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate">Email Address</p>
              <p className="text-sm font-medium text-blue-deep">{user?.email ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <Shield className="w-4 h-4 text-slate flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate">Role</p>
              <p className="text-sm font-medium text-blue-deep capitalize">{user?.role ?? '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-deep mb-1.5">Current password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-deep mb-1.5">New password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-primary"
            />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
