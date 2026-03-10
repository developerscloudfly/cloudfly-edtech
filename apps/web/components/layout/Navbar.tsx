'use client';

import Link from 'next/link';
import { Bell, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ash bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate hover:text-blue-deep"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Page title or logo */}
        <div className="flex-1">
          {title ? (
            <h1 className="font-heading font-semibold text-blue-deep">{title}</h1>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xs">CF</span>
              </div>
              <span className="font-heading font-bold text-blue-deep">CloudFly EdTech</span>
            </Link>
          )}
        </div>

        {/* Search */}
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ash bg-bg-base text-slate text-sm hover:border-blue-primary transition-colors">
          <Search className="w-4 h-4" />
          <span>Search courses...</span>
          <kbd className="ml-2 text-xs bg-ash rounded px-1.5 py-0.5">⌘K</kbd>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button className="relative p-2 text-slate hover:text-blue-deep rounded-lg hover:bg-bg-base transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-accent rounded-full" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-primary/10 flex items-center justify-center cursor-pointer">
                  <span className="text-blue-primary font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ash bg-surface px-4 py-3 space-y-2">
          <Link href="/courses" className="block py-2 text-sm text-slate hover:text-blue-primary">
            Browse Courses
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm text-slate hover:text-blue-primary">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left py-2 text-sm text-red-500 hover:text-red-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm text-slate hover:text-blue-primary">
                Sign in
              </Link>
              <Link href="/register" className="block py-2 text-sm text-blue-primary font-medium">
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
