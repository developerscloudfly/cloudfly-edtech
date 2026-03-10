import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession({
      courseId: course._id.toString(),
      courseTitle: course.title,
      amount: course.price,
      currency: 'usd',
      userId: session.user.id,
      successUrl: `${baseUrl}/dashboard?payment=success&courseId=${courseId}`,
      cancelUrl: `${baseUrl}/courses/${course.slug}?payment=cancelled`,
    });

    return NextResponse.json({ success: true, data: { url: checkoutSession.url } });
  } catch (err) {
    console.error('[POST /api/payments/stripe/checkout]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
