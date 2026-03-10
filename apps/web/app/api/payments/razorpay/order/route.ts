import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
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

    const order = await createRazorpayOrder({
      amount: course.price,
      currency: 'INR',
      courseId: course._id.toString(),
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    console.error('[POST /api/payments/razorpay/order]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
