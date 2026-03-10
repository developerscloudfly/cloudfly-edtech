import Link from 'next/link';
import {
  BookOpen,
  Video,
  Award,
  Users,
  Zap,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
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

const stats = [
  { value: '10,000+', label: 'Students enrolled' },
  { value: '200+', label: 'Expert instructors' },
  { value: '500+', label: 'Courses available' },
  { value: '95%', label: 'Completion rate' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Infosys',
    content: 'CloudFly helped me land my first job in 6 months. The live sessions and project feedback were invaluable.',
    avatar: 'P',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Data Scientist at Accenture',
    content: 'The structured course paths and AI notes made learning so efficient. Best EdTech platform I have used.',
    avatar: 'A',
  },
  {
    name: 'Sarah Chen',
    role: 'UX Designer at Razorpay',
    content: 'Got certified and found my dream job within 3 months. The community support is incredible.',
    avatar: 'S',
  },
];

const featuredCourses = [
  {
    id: '1',
    title: 'Full-Stack Web Development Bootcamp',
    instructor: 'Rahul Verma',
    price: 49,
    isFree: false,
    level: 'beginner',
    enrolled: 3200,
    rating: 4.9,
    thumbnail: null,
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: '2',
    title: 'Machine Learning with Python',
    instructor: 'Dr. Sneha Rao',
    price: 0,
    isFree: true,
    level: 'intermediate',
    enrolled: 5800,
    rating: 4.8,
    thumbnail: null,
    tags: ['Python', 'TensorFlow', 'Data Science'],
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    instructor: 'Arjun Mehta',
    price: 39,
    isFree: false,
    level: 'beginner',
    enrolled: 2100,
    rating: 4.7,
    thumbnail: null,
    tags: ['Figma', 'Design', 'Prototyping'],
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
              Join 10,000+ students learning cutting-edge skills through expert-led courses,
              live sessions, hands-on projects, and industry-recognized certificates.
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

      {/* Stats */}
      <section className="bg-surface border-b border-ash">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-3xl font-bold text-blue-primary">{stat.value}</p>
                <p className="text-slate text-sm mt-1">{stat.label}</p>
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

      {/* Featured Courses */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-blue-deep">Featured Courses</h2>
              <p className="text-slate mt-2">Start learning with our most popular courses.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/courses">View all courses</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-blue-primary/10 to-blue-deep/20 flex items-center justify-center relative">
                  <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-blue-primary ml-1" fill="currentColor" />
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {course.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {course.isFree && (
                    <Badge variant="accent" className="absolute top-2 right-2">
                      Free
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center gap-1 text-yellow-accent mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5"
                        fill={i < Math.floor(course.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                    <span className="text-xs text-slate ml-1">{course.rating}</span>
                  </div>

                  <h3 className="font-heading font-semibold text-blue-deep text-base leading-snug mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate mb-3">by {course.instructor}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      {course.isFree ? (
                        <span className="font-heading font-bold text-green-600 text-lg">Free</span>
                      ) : (
                        <span className="font-heading font-bold text-blue-deep text-lg">
                          ${course.price}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate">{course.enrolled.toLocaleString()} enrolled</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-blue-deep mb-4">
              Loved by learners worldwide
            </h2>
            <p className="text-slate text-lg">Real stories from real students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-yellow-accent mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate text-sm leading-relaxed mb-4 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-deep text-sm">{testimonial.name}</p>
                      <p className="text-xs text-slate">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            Join thousands of learners already building their future on CloudFly.
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
