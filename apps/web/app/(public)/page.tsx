import Link from 'next/link';
import {
  BookOpen,
  Video,
  Award,
  Users,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';

const features = [
  {
    icon: Video,
    title: 'Live Interactive Sessions',
    description: 'Join real-time classes with instructors via LiveKit-powered video. Ask questions, collaborate, and learn together.',
  },
  {
    icon: BookOpen,
    title: 'Structured Course Paths',
    description: 'Follow curated learning paths with video lessons, quizzes, and projects — from beginner to advanced.',
  },
  {
    icon: Award,
    title: 'Verifiable Certificates',
    description: 'Earn blockchain-style verifiable certificates upon course completion. Share with employers instantly.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Auto Notes',
    description: 'Take timestamped notes while watching lessons. Export them as PDF or plain text anytime.',
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Discuss topics, ask questions, and help fellow learners in course-specific discussion threads.',
  },
  {
    icon: Globe,
    title: 'Multi-Currency Payments',
    description: 'Pay with Stripe (international) or Razorpay (India). Flexible pricing for every budget.',
  },
];

const whyCloudFly = [
  {
    icon: '🚀',
    title: 'Launching Soon',
    description: 'We are actively building and onboarding our first batch of instructors and courses.',
  },
  {
    icon: '🎓',
    title: 'Early Access',
    description: 'Sign up now to get early access, founding-member pricing, and shape the platform with your feedback.',
  },
  {
    icon: '🤝',
    title: 'Built with Learners',
    description: 'Every feature — from live sessions to auto-notes — was designed based on real learner needs.',
  },
];

const upcomingCourses = [
  {
    id: '1',
    title: 'Full-Stack Web Development',
    description: 'Build complete web applications with React, Node.js, and MongoDB from scratch.',
    level: 'beginner',
    tags: ['React', 'Node.js', 'MongoDB'],
    status: 'Coming Soon',
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Learn data analysis, visualisation, and machine learning fundamentals with Python.',
    level: 'intermediate',
    tags: ['Python', 'Pandas', 'Data Science'],
    status: 'Coming Soon',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Master user research, wireframing, and prototyping using industry-standard tools.',
    level: 'beginner',
    tags: ['Figma', 'Design', 'Prototyping'],
    status: 'Coming Soon',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-deep via-blue-primary to-blue-deep">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="accent" className="mb-6 text-sm px-4 py-1.5">
              New: Live sessions powered by LiveKit
            </Badge>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Learn Without Limits.{' '}
              <span className="text-yellow-accent">Build Without Boundaries.</span>
            </h1>

            <p className="text-blue-100 text-lg lg:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Learn cutting-edge skills through expert-led courses, live sessions,
              hands-on projects, and verifiable certificates — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="accent" asChild>
                <Link href="/courses">
                  Explore Courses <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                asChild
              >
                <Link href="/register">
                  Start for Free
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-blue-100 text-sm">
              {['No credit card required', 'Cancel anytime', 'Certificate on completion'].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-yellow-accent" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why CloudFly — honest launch messaging */}
      <section className="bg-surface border-b border-ash">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyCloudFly.map((item) => (
              <div key={item.title} className="text-center px-4">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-heading text-lg font-bold text-blue-deep mt-2">{item.title}</p>
                <p className="text-slate text-sm mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-blue-deep mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-slate text-lg max-w-2xl mx-auto">
              A complete learning ecosystem designed for the modern learner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-blue-deep text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Courses */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-blue-deep">Courses Coming Soon</h2>
              <p className="text-slate mt-2">Here&apos;s a preview of what we&apos;re building. More courses added regularly.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/courses">View all courses</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden group">
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-gradient-to-br from-blue-primary/10 to-blue-deep/20 flex items-center justify-center relative">
                  <BookOpen className="w-12 h-12 text-blue-primary/40" />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {course.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="accent" className="absolute top-2 right-2 capitalize">
                    {course.level}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold text-blue-deep text-base leading-snug mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate mb-4 leading-relaxed">{course.description}</p>
                  <span className="inline-block text-xs font-medium text-blue-primary bg-blue-primary/10 px-3 py-1 rounded-full">
                    {course.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access CTA — replaces fake testimonials */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-blue-deep mb-4">
            Be one of our first learners
          </h2>
          <p className="text-slate text-lg mb-8 leading-relaxed">
            CloudFly is just getting started. Join early, explore courses as they launch,
            and help us build the learning experience you always wanted.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '📬', text: 'Get notified when new courses go live' },
              { icon: '💬', text: 'Share feedback that shapes the platform' },
              { icon: '🏷️', text: 'Founding member pricing on paid courses' },
            ].map((item) => (
              <div key={item.text} className="bg-surface rounded-xl p-5 border border-ash">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm text-slate mt-2 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-deep to-blue-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Create a free account and be ready when our first courses go live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="accent" asChild>
              <Link href="/register">Create free account</Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="bg-transparent text-white border-white/30 hover:bg-white/10"
              asChild
            >
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-deep text-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-accent flex items-center justify-center">
                  <span className="text-blue-deep font-heading font-bold text-sm">CF</span>
                </div>
                <span className="font-heading font-bold text-white text-lg">CloudFly</span>
              </div>
              <p className="text-sm text-blue-200 leading-relaxed">
                Modern online learning platform for tomorrow&apos;s professionals.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><Link href="/courses" className="hover:text-yellow-accent transition-colors">Browse Courses</Link></li>
                <li><Link href="/register" className="hover:text-yellow-accent transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-yellow-accent transition-colors">Log In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-yellow-accent transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-accent transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-yellow-accent transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-yellow-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-accent transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm text-blue-200">
            &copy; {new Date().getFullYear()} CloudFly EdTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
