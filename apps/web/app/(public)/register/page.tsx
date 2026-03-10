'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Registration failed.');
        return;
      }
      router.push('/login?registered=1');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-primary flex items-center justify-center">
              <span className="text-white font-heading font-bold">CF</span>
            </div>
            <span className="font-heading font-bold text-blue-deep text-xl">CloudFly</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">Create your account</h1>
          <p className="text-slate text-sm mt-1">Start learning for free today</p>
        </div>

        <div className="bg-surface border border-ash rounded-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-deep mb-1.5">Full name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm text-blue-deep placeholder:text-slate focus:outline-none focus:border-blue-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-deep mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm text-blue-deep placeholder:text-slate focus:outline-none focus:border-blue-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-deep mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm text-blue-deep placeholder:text-slate focus:outline-none focus:border-blue-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-deep mb-1.5">I am a...</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-ash rounded-lg px-4 py-2.5 text-sm text-blue-deep bg-surface focus:outline-none focus:border-blue-primary"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-slate mt-4">
            By signing up, you agree to our{' '}
            <a href="#" className="text-blue-primary hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-primary hover:underline">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-slate mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-primary font-medium hover:text-blue-deep">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
