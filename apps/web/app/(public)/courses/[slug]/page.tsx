import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BookOpen, Star, CheckCircle } from 'lucide-react';

interface CourseDetailPageProps {
  params: { slug: string };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  // In production, fetch course by slug from the API/DB
  const { slug } = params;

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-deep to-blue-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="accent">Beginner</Badge>
                <Badge className="bg-white/20 text-white border-0">Full-Stack</Badge>
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
                Course: {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                A comprehensive course to master modern web development from scratch to deployment.
              </p>
              <div className="flex items-center gap-6 text-sm text-blue-100 mb-8">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 40 hours</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 3,200 enrolled</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-accent" fill="currentColor" /> 4.9 (320 reviews)</span>
              </div>
              <div className="flex gap-4">
                <Button size="lg" variant="accent">Enroll Now — $49</Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Preview Course
                </Button>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl aspect-video flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/40" />
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold text-blue-deep mb-6">What you will learn</h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-10">
                {[
                  'Build full-stack web applications',
                  'Master React and Next.js',
                  'Design RESTful APIs with Node.js',
                  'Work with MongoDB and Mongoose',
                  'Deploy to production with Vercel',
                  'Implement authentication and payments',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-slate">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>

              <h2 className="font-heading text-2xl font-bold text-blue-deep mb-6">Course Curriculum</h2>
              <div className="space-y-3">
                {['Introduction & Setup', 'React Fundamentals', 'Next.js App Router', 'Backend with Express', 'Database Design', 'Authentication', 'Payment Integration', 'Deployment'].map((module, i) => (
                  <div key={module} className="border border-ash rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-blue-primary/10 text-blue-primary text-xs font-semibold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-medium text-blue-deep text-sm">{module}</span>
                    </div>
                    {i < 2 && <Badge variant="accent" className="text-xs">Preview</Badge>}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="border border-ash rounded-2xl bg-surface p-6 sticky top-24">
                <div className="text-3xl font-heading font-bold text-blue-deep mb-2">$49</div>
                <p className="text-sm text-slate mb-6">One-time payment, lifetime access</p>
                <Button className="w-full mb-3" size="lg">Enroll Now</Button>
                <Button variant="outline" className="w-full mb-6" size="lg">Try for Free</Button>
                <ul className="space-y-2 text-sm text-slate">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 40+ hours of video</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Live Q&A sessions</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Project reviews</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Completion certificate</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Lifetime access</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
