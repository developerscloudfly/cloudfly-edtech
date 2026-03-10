import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import { auth } from '@/lib/auth';

// POST /api/enrollments — enroll in a free course
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await req.json();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    if (!course.isFree) {
      return NextResponse.json(
        { success: false, error: 'This course requires payment.' },
        { status: 400 }
      );
    }

    const existing = await Enrollment.findOne({ userId: session.user.id, courseId });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already enrolled' }, { status: 409 });
    }

    const enrollment = await Enrollment.create({
      userId: session.user.id,
      courseId,
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/enrollments]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
