import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES: Record<string, string[]> = {
  admin:      ['/admin'],
  instructor: ['/instructor'],
  student:    ['/dashboard', '/learn', '/forum', '/projects', '/profile', '/certificates', '/live'],
};

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes — always accessible
  if (
    pathname === '/' ||
    pathname.startsWith('/courses') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/courses') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Not logged in — redirect to login
  if (!session?.user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role ?? 'student';

  // Role-based access
  for (const [requiredRole, prefixes] of Object.entries(ROLE_ROUTES)) {
    if (prefixes.some((p) => pathname.startsWith(p))) {
      if (role !== requiredRole && !(requiredRole === 'student')) {
        // Wrong role — redirect to their own dashboard
        const dashboardMap: Record<string, string> = {
          admin:      '/admin/dashboard',
          instructor: '/instructor/dashboard',
          student:    '/dashboard',
        };
        return NextResponse.redirect(new URL(dashboardMap[role] ?? '/', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
