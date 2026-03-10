import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import CloudCredit from '@/models/CloudCredit';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const credits = await CloudCredit.findOne({ userId: session.user.id });

    return NextResponse.json({
      success: true,
      data: credits ?? { userId: session.user.id, total: 0, history: [] },
    });
  } catch (err) {
    console.error('[GET /api/credits/me]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
