import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CourseGridSkeleton } from '@/components/shared/SkeletonLoader';
import { Search, Filter } from 'lucide-react';

async function CourseCatalog() {
  // In production this would fetch from the API
  return (
    <div className="text-center py-12 text-slate">
      <p>No courses published yet. Check back soon!</p>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-blue-deep mb-2">Course Catalog</h1>
          <p className="text-slate">Explore our library of expert-led courses.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-2.5 border border-ash rounded-lg text-sm bg-surface focus:outline-none focus:border-blue-primary"
            />
          </div>
          <div className="flex gap-3">
            <select className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate focus:outline-none focus:border-blue-primary">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate focus:outline-none focus:border-blue-primary">
              <option value="">All Types</option>
              <option value="short">Short Course</option>
              <option value="long">Long Course</option>
            </select>
            <select className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate focus:outline-none focus:border-blue-primary">
              <option value="">Price</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <Suspense fallback={<CourseGridSkeleton count={8} />}>
          <CourseCatalog />
        </Suspense>
      </main>
    </div>
  );
}
