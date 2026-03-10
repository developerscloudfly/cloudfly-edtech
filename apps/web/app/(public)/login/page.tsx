'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error ?? 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-primary flex items-center justify-center">
              <span className="text-white font-heading font-bold">CF</span>
            </div>
            <span className="font-heading font-bold text-blue-deep text-xl">CloudFly</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">Welcome back</h1>
          <p className="text-slate text-sm mt-1">Sign in to continue learning</p>
        </div>

        <div className="bg-surface border border-ash rounded-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-deep mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm text-blue-deep placeholder:text-slate focus:outline-none focus:border-blue-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-deep mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm text-blue-deep placeholder:text-slate focus:outline-none focus:border-blue-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-sm text-blue-primary hover:text-blue-deep">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-slate mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-primary font-medium hover:text-blue-deep">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
