import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import ForumPost from '@/models/ForumPost';
import Enrollment from '@/models/Enrollment';

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      ForumPost.find({ courseId: params.courseId })
        .populate('authorId', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ForumPost.countDocuments({ courseId: params.courseId }),
    ]);

    return NextResponse.json({
      success: true,
      data: { items: posts, total, page, limit },
    });
  } catch (err) {
    console.error('[GET /api/forum/[courseId]/posts]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { title, content } = await req.json();

    // Verify enrollment (instructors/admins can post without enrollment)
    if (session.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        userId: session.user.id,
        courseId: params.courseId,
      });
      if (!enrollment) {
        return NextResponse.json({ success: false, error: 'Not enrolled' }, { status: 403 });
      }
    }

    const post = await ForumPost.create({
      courseId: params.courseId,
      authorId: session.user.id,
      title,
      content,
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/forum/[courseId]/posts]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
