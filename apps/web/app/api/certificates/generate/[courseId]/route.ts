import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Certificate from '@/models/Certificate';
import Enrollment from '@/models/Enrollment';
import Lesson from '@/models/Lesson';

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;
    await connectDB();

    const enrollment = await Enrollment.findOne({ userId: session.user.id, courseId });
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Not enrolled in this course' }, { status: 403 });
    }

    // Verify course completion (100% progress required)
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = enrollment.completedLessons.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    if (progress < 100) {
      return NextResponse.json(
        { success: false, error: `Course not complete. Current progress: ${progress}%` },
        { status: 400 }
      );
    }

    // Upsert certificate
    const existing = await Certificate.findOne({ userId: session.user.id, courseId });
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const certificate = await Certificate.create({ userId: session.user.id, courseId });

    return NextResponse.json({ success: true, data: certificate }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/certificates/generate/[courseId]]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
