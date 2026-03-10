import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['instructor', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // In production: upload recording file to YouTube via youtube.videos.insert()
    // This is a stub — real implementation requires multipart upload handling
    const { sessionId, title } = await req.json();

    return NextResponse.json({
      success: true,
      data: {
        message: 'Upload queued. This feature requires server-side YouTube API integration.',
        sessionId,
        title,
      },
    });
  } catch (err) {
    console.error('[POST /api/youtube/upload-recording]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
