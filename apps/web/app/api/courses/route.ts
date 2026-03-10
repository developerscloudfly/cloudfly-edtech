import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { auth } from '@/lib/auth';

// GET /api/courses — list published courses
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '12'));
    const skip = (page - 1) * limit;
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const q = searchParams.get('q');

    const filter: Record<string, unknown> = { status: 'published' };
    if (type) filter.type = type;
    if (level) filter.level = level;
    if (q) filter.$text = { $search: q };

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('instructorId', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { items: courses, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[GET /api/courses]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/courses — create course (instructor only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['instructor', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const course = await Course.create({ ...body, instructorId: session.user.id });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/courses]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
