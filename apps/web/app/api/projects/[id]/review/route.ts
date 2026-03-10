import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import ProjectSubmission from '@/models/ProjectSubmission';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user || !['instructor', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const { grade, instructorFeedback } = await req.json();

    const submission = await ProjectSubmission.findByIdAndUpdate(
      params.id,
      {
        $set: {
          grade,
          instructorFeedback,
          status: 'reviewed',
          reviewedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (err) {
    console.error('[POST /api/projects/[id]/review]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
