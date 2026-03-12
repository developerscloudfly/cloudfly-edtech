'use client';

import { useState } from 'react';
import { Settings, Lock, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [alert, setAlert] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert('Feature coming soon. Password management will be available in the next update.');
  };

  const platformInfo = [
    { label: 'App Name', value: 'CloudFly EdTech' },
    { label: 'Version', value: '1.0.0-beta' },
    { label: 'Environment', value: 'Production' },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">Settings</h1>
        <p className="text-slate text-sm mt-1">Manage your account and platform preferences.</p>
      </div>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-primary" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alert && (
            <div className="text-sm text-blue-primary bg-blue-primary/10 border border-blue-primary/20 rounded-lg px-4 py-3 mb-4">
              {alert}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate mb-1">
                Current Password
              </label>
              <input
                required
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="w-full border border-ash rounded-lg px-3 py-2.5 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate mb-1">New Password</label>
              <input
                required
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="w-full border border-ash rounded-lg px-3 py-2.5 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate mb-1">
                Confirm New Password
              </label>
              <input
                required
                type="password"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                className="w-full border border-ash rounded-lg px-3 py-2.5 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                placeholder="Confirm new password"
              />
            </div>
            <Button type="submit" className="mt-1">
              Save Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-primary" />
            Platform Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {platformInfo.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-ash/40 last:border-0">
                <dt className="text-sm text-slate">{item.label}</dt>
                <dd className="text-sm font-medium text-blue-deep">{item.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Admin Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-primary" />
            Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate">
            Additional configuration options including email templates, payment gateway settings,
            and notification preferences will be available in future releases.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
