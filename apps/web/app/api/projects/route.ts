import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import ProjectSubmission from '@/models/ProjectSubmission';
import Enrollment from '@/models/Enrollment';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const filter = session.user.role === 'student'
      ? { userId: session.user.id }
      : {};

    const submissions = await ProjectSubmission.find(filter)
      .populate('userId', 'name email avatar')
      .populate('courseId', 'title slug')
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: submissions });
  } catch (err) {
    console.error('[GET /api/projects]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId, title, description, fileUrls } = await req.json();

    const enrollment = await Enrollment.findOne({ userId: session.user.id, courseId });
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Not enrolled in this course' }, { status: 403 });
    }

    const submission = await ProjectSubmission.create({
      userId: session.user.id,
      courseId,
      title,
      description,
      fileUrls: fileUrls ?? [],
    });

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/projects]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
