'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FolderKanban,
  MessageSquare,
  User,
  Award,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  GraduationCap,
  ClipboardList,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/courses', icon: BookOpen },
  { label: 'Live Sessions', href: '/live', icon: Radio },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Forum', href: '/forum', icon: MessageSquare },
  { label: 'Certificates', href: '/certificates', icon: Award },
  { label: 'Profile', href: '/profile', icon: User },
];

const instructorNav: NavItem[] = [
  { label: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
  { label: 'Live Sessions', href: '/instructor/live', icon: Radio },
  { label: 'Submissions', href: '/instructor/submissions', icon: ClipboardList },
  { label: 'Gradebook', href: '/instructor/gradebook', icon: GraduationCap },
  { label: 'Profile', href: '/profile', icon: User },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Payments', href: '/admin/payments', icon: DollarSign },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();

  const navItems =
    role === 'admin'
      ? adminNav
      : role === 'instructor'
      ? instructorNav
      : studentNav;

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-surface border-r border-ash">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-ash">
        <div className="w-8 h-8 rounded-lg bg-blue-primary flex items-center justify-center">
          <span className="text-white font-heading font-bold text-sm">CF</span>
        </div>
        <span className="font-heading font-bold text-blue-deep text-lg">CloudFly</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-primary/10 text-blue-primary'
                  : 'text-slate hover:bg-bg-base hover:text-blue-deep'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-ash">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-primary font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-deep truncate">{user?.name}</p>
            <p className="text-xs text-slate capitalize">{role}</p>
          </div>
          <button
            onClick={logout}
            className="text-slate hover:text-red-500 transition-colors text-xs"
            title="Sign out"
          >
            Exit
          </button>
        </div>
      </div>
    </aside>
  );
}
