import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Lesson from '@/models/Lesson';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
    }

    const enrollment = await Enrollment.findOne({
      userId: session.user.id,
      courseId: lesson.courseId,
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Not enrolled' }, { status: 403 });
    }

    const lessonObjectId = new mongoose.Types.ObjectId(id);
    const alreadyCompleted = enrollment.completedLessons.some((lid) =>
      lid.equals(lessonObjectId)
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lessonObjectId);

      // Recalculate progress
      const totalLessons = await Lesson.countDocuments({ courseId: lesson.courseId });
      enrollment.progressPercent = totalLessons > 0
        ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
        : 0;

      await enrollment.save();
    }

    return NextResponse.json({
      success: true,
      data: { progressPercent: enrollment.progressPercent, completedLessons: enrollment.completedLessons.length },
    });
  } catch (err) {
    console.error('[POST /api/lessons/[id]/complete]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
