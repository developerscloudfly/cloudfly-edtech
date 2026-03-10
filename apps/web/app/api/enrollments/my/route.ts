import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { auth } from '@/lib/auth';

// GET /api/enrollments/my — current user's enrollments
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const enrollments = await Enrollment.find({ userId: session.user.id })
      .populate('courseId', 'title slug thumbnail level type totalDuration')
      .sort({ enrolledAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: enrollments });
  } catch (err) {
    console.error('[GET /api/enrollments/my]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
