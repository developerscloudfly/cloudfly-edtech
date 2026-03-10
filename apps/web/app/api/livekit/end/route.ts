import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { endLiveKitRoom } from '@/lib/livekit';
import connectDB from '@/lib/db';
import LiveSession from '@/models/LiveSession';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await req.json();

    await connectDB();
    const liveSession = await LiveSession.findById(sessionId);
    if (!liveSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    const isInstructor =
      session.user.role === 'admin' ||
      liveSession.instructorId.toString() === session.user.id;

    if (!isInstructor) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await endLiveKitRoom(liveSession.livekitRoomName);
    await LiveSession.findByIdAndUpdate(sessionId, { status: 'ended' });

    return NextResponse.json({ success: true, message: 'Session ended' });
  } catch (err) {
    console.error('[POST /api/livekit/end]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
