'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { BookOpen, Search, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InstructorRef {
  _id: string;
  name: string;
  email: string;
}

interface CourseItem {
  _id: string;
  title: string;
  slug: string;
  level: string;
  status: 'draft' | 'published' | 'archived';
  price: number;
  isFree: boolean;
  enrollmentCount: number;
  instructorId: InstructorRef | null;
  type: string;
}

interface PaginationData {
  items: CourseItem[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-ash/30 text-slate border-ash/40',
  published: 'bg-green-500/10 text-green-700 border-green-500/20',
  archived: 'bg-orange-400/10 text-orange-600 border-orange-400/20',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminCoursesPage() {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'beginner',
    type: 'short',
    price: '0',
    tags: '',
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCourses = useCallback(async (q: string, status: string, p: number) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (q) params.set('q', q);
      if (status) params.set('status', status);
      const res = await fetch(`/api/admin/courses?${params}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error ?? 'Failed to load courses');
    } catch {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(search, statusFilter, page);
  }, [fetchCourses, statusFilter, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchCourses(val, statusFilter, 1);
    }, 500);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const price = parseFloat(form.price) || 0;
      const slug = slugify(form.title) || `course-${Date.now()}`;
      const payload = {
        title: form.title,
        description: form.description,
        level: form.level,
        type: form.type,
        price,
        isFree: price === 0,
        tags,
        slug,
        status: 'draft',
      };
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setForm({ title: '', description: '', level: 'beginner', type: 'short', price: '0', tags: '' });
        fetchCourses(search, statusFilter, page);
      } else {
        setFormError(json.error ?? 'Failed to create course');
      }
    } catch {
      setFormError('Failed to create course');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-blue-deep">Course Management</h1>
          <p className="text-slate text-sm mt-1">Review, publish, and manage all courses.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Course
        </Button>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-surface border border-ash rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowModal(false); setFormError(''); }}
              className="absolute top-4 right-4 text-slate hover:text-blue-deep"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-heading text-lg font-bold text-blue-deep mb-4">Create New Course</h2>
            {formError && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {formError}
              </div>
            )}
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                />
                {form.title && (
                  <p className="text-xs text-slate mt-1">
                    Slug: <span className="font-mono">{slugify(form.title)}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate mb-1">Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                  >
                    <option value="short">Short Course</option>
                    <option value="long">Long Course</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1">
                  Price (0 = Free)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. react, javascript, web"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border border-ash rounded-lg px-3 py-2 text-sm bg-bg-base focus:outline-none focus:border-blue-primary"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? 'Creating...' : 'Create Course'}
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
            placeholder="Search courses..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-ash rounded-lg text-sm bg-surface focus:outline-none focus:border-blue-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate focus:outline-none focus:border-blue-primary"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Courses{data ? ` (${data.total})` : ''}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="animate-pulse space-y-0 divide-y divide-ash/40">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-ash/40 rounded w-48" />
                    <div className="h-3 bg-ash/30 rounded w-32" />
                  </div>
                  <div className="h-5 bg-ash/30 rounded w-20" />
                  <div className="h-5 bg-ash/30 rounded w-16" />
                  <div className="h-3 bg-ash/20 rounded w-12" />
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="text-center py-10 text-slate">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-ash" />
              <p className="font-medium">No courses yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ash/60 bg-bg-base/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Level
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">
                      Enrolled
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash/40">
                  {data.items.map((course) => (
                    <tr key={course._id} className="hover:bg-bg-base/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-blue-deep leading-snug">{course.title}</p>
                        <p className="text-xs text-slate font-mono mt-0.5">{course.slug}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate text-xs">
                        {course.instructorId?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs capitalize text-slate">{course.level}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[course.status] ?? 'bg-ash/10 text-slate border-ash'}`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-blue-deep">
                        {course.isFree || course.price === 0 ? (
                          <span className="text-green-700 font-medium text-xs">Free</span>
                        ) : (
                          <span>₹{course.price.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate">
                        {course.enrollmentCount}
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
