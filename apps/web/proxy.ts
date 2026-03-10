import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Role-based route protection map
const ROUTE_ROLE_MAP: Record<string, string[]> = {
  '/dashboard': ['student', 'instructor', 'admin'],
  '/learn': ['student', 'instructor', 'admin'],
  '/live': ['student', 'instructor', 'admin'],
  '/projects': ['student', 'instructor', 'admin'],
  '/forum': ['student', 'instructor', 'admin'],
  '/profile': ['student', 'instructor', 'admin'],
  '/certificates': ['student', 'instructor', 'admin'],
  '/instructor': ['instructor', 'admin'],
  '/admin': ['admin'],
};

const PUBLIC_ROUTES = ['/', '/courses', '/login', '/register'];
const API_AUTH_ROUTES = ['/api/auth'];

function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  return null;
}

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return true;
  }
  if (API_AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return true;
  }
  return false;
}

export default auth(function proxy(req: NextRequest & { auth: { user?: { role?: string } } | null }) {
  const { pathname } = req.nextUrl;
  const session = (req as unknown as { auth: { user?: { role?: string } } | null }).auth;

  // Allow public routes and auth API routes
  if (isPublicRoute(pathname)) {
    // Redirect logged-in users away from login/register
    if (session?.user && (pathname === '/login' || pathname === '/register')) {
      const role = session.user.role;
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else if (role === 'instructor') {
        return NextResponse.redirect(new URL('/instructor/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return NextResponse.next();
  }

  // Require authentication for protected routes
  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles !== null) {
    if (!session?.user) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = session.user.role ?? 'student';
    if (!requiredRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else if (userRole === 'instructor') {
        return NextResponse.redirect(new URL('/instructor/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
