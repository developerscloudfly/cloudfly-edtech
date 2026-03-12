'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Users, Search, Plus, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}

interface PaginationData {
  items: UserItem[];
  total: number;
  page: number;
  totalPages: number;
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-blue-primary/10 text-blue-primary border-blue-primary/20',
  instructor: 'bg-yellow-accent/10 text-yellow-600 border-yellow-accent/20',
  student: 'bg-green-500/10 text-green-700 border-green-500/20',
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[role] ?? 'bg-ash/10 text-slate border-ash'}`}
    >
      {role}
    </span>
  );
}

export default function AdminUsersPage() {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(
    async (q: string, role: string, p: number) => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ page: String(p), limit: '20' });
        if (q) params.set('q', q);
        if (role) params.set('role', role);
        const res = await fetch(`/api/admin/users?${params}`);
        const json = await res.json();
        if (json.success) setData(json.data);
        else setError(json.error ?? 'Failed to load users');
      } catch {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(search, roleFilter, page);
  }, [fetchUsers, roleFilter, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(val, roleFilter, 1);
    }, 500);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchUsers(search, roleFilter, page);
      else alert(json.error ?? 'Delete failed');
    } catch {
      alert('Delete failed');
    }
  };

  const handleRoleUpdate = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (json.success) fetchUsers(search, roleFilter, page);
      else alert(json.error ?? 'Update failed');
    } catch {
      alert('Update failed');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setForm({ name: '', email: '', password: '', role: 'student' });
        fetchUsers(search, roleFilter, page);
      } else {
        setFormError(json.error ?? 'Failed to create user');
      }
    } catch {
      setFormError('Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">User Management</h1>
          <p className="text-slate text-sm mt-1">View, search, and manage all platform users.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-surface border border-ash rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => { setShowModal(false); setFormError(''); }}
              className="absolute top-4 right-4 text-slate hover:text-blue-deep"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-heading text-lg font-bold text-blue-deep mb-4">Add New User</h2>
            {formError && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {formError}
              </div>
            )}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1">Password</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? 'Creating...' : 'Create User'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowModal(false); setFormError(''); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-ash rounded-lg text-sm bg-surface focus:outline-none focus:border-blue-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate focus:outline-none focus:border-blue-primary"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            All Users{data ? ` (${data.total})` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="animate-pulse space-y-0 divide-y divide-ash/40">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-full bg-ash/40" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-ash/40 rounded w-32" />
                    <div className="h-3 bg-ash/30 rounded w-48" />
                  </div>
                  <div className="h-5 bg-ash/30 rounded w-16" />
                  <div className="h-3 bg-ash/20 rounded w-20" />
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="text-center py-10 text-slate">
              <Users className="w-10 h-10 mx-auto mb-3 text-ash" />
              <p className="font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ash/60 bg-bg-base/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash/40">
                  {data.items.map((user) => (
                    <tr key={user._id} className="hover:bg-bg-base/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-primary/10 flex items-center justify-center text-blue-primary font-semibold text-sm flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-blue-deep">{user.name}</p>
                            <p className="text-xs text-slate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                          className={`border rounded-full px-2 py-0.5 text-xs font-medium focus:outline-none cursor-pointer ${ROLE_COLORS[user.role] ?? 'bg-ash/10 text-slate border-ash'}`}
                        >
                          <option value="student">student</option>
                          <option value="instructor">instructor</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-ash text-slate hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate px-2">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="p-1.5 rounded-lg border border-ash text-slate hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
