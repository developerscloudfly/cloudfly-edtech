import type { Types } from 'mongoose';

// ─── Shared ───────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'instructor' | 'admin';
export type CourseType = 'short' | 'long';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type LessonType = 'video' | 'quiz' | 'live';
export type LiveSessionStatus = 'scheduled' | 'live' | 'ended';
export type SubmissionStatus = 'pending' | 'reviewed';
export type PaymentGateway = 'stripe' | 'razorpay';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

// ─── API Response shapes ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Plain object types (for client) ──────────────────────────────────────────

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CourseDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: CourseType;
  price: number;
  isFree: boolean;
  freeModuleCount: number;
  instructorId: string;
  instructor?: UserDTO;
  thumbnail?: string;
  tags: string[];
  level: CourseLevel;
  status: CourseStatus;
  enrollmentCount: number;
  totalDuration: number;
  cohortStartDate?: string;
  cohortEndDate?: string;
  createdAt: string;
}

export interface ModuleDTO {
  id: string;
  courseId: string;
  title: string;
  order: number;
  isPreview: boolean;
  lessons?: LessonDTO[];
}

export interface LessonDTO {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  type: LessonType;
  youtubeVideoId?: string;
  duration: number;
  order: number;
  isPreview: boolean;
  liveSessionId?: string;
}

export interface EnrollmentDTO {
  id: string;
  userId: string;
  courseId: string;
  paymentId?: string;
  completedLessons: string[];
  progressPercent: number;
  enrolledAt: string;
}

export interface PaymentDTO {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  gatewayPaymentId: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface CertificateDTO {
  id: string;
  userId: string;
  courseId: string;
  shareableToken: string;
  issuedAt: string;
  course?: CourseDTO;
  user?: UserDTO;
}

// ─── NextAuth session augmentation ───────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      avatar?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    avatar?: string;
  }
}
