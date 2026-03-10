import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateLiveKitToken } from '@/lib/livekit';
import connectDB from '@/lib/db';
import LiveSession from '@/models/LiveSession';
import Enrollment from '@/models/Enrollment';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { roomName, sessionId } = await req.json();

    await connectDB();
    const liveSession = await LiveSession.findById(sessionId);
    if (!liveSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    const isInstructor =
      session.user.role === 'admin' ||
      liveSession.instructorId.toString() === session.user.id;

    if (!isInstructor) {
      const enrollment = await Enrollment.findOne({
        userId: session.user.id,
        courseId: liveSession.courseId,
      });
      if (!enrollment) {
        return NextResponse.json({ success: false, error: 'Not enrolled' }, { status: 403 });
      }
    }

    const token = await generateLiveKitToken({
      roomName: liveSession.livekitRoomName,
      participantName: session.user.name ?? session.user.email ?? 'Anonymous',
      participantId: session.user.id,
      isInstructor,
    });

    return NextResponse.json({ success: true, data: { token, roomName: liveSession.livekitRoomName } });
  } catch (err) {
    console.error('[POST /api/livekit/token]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
