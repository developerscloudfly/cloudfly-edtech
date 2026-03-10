'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  const role = user?.role as UserRole | undefined;
  const isStudent = role === 'student';
  const isInstructor = role === 'instructor';
  const isAdmin = role === 'admin';

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    if (result?.ok) {
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else if (isInstructor) {
        router.push('/instructor/dashboard');
      } else {
        router.push('/dashboard');
      }
      return { success: true };
    }

    return { success: false, error: 'Unknown error' };
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const requireAuth = (requiredRole?: UserRole) => {
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }
    if (requiredRole && role !== requiredRole) {
      router.push('/dashboard');
      return false;
    }
    return true;
  };

  return {
    user,
    role,
    isLoading,
    isAuthenticated,
    isStudent,
    isInstructor,
    isAdmin,
    login,
    logout,
    requireAuth,
  };
}
