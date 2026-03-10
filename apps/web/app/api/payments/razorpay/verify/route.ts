import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import connectDB from '@/lib/db';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, paymentId, signature, courseId } = await req.json();

    const isValid = verifyRazorpaySignature({ orderId, paymentId, signature });
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    await connectDB();
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const payment = await Payment.create({
      userId: session.user.id,
      courseId,
      amount: course.price,
      currency: 'INR',
      gateway: 'razorpay',
      gatewayPaymentId: paymentId,
      status: 'success',
    });

    const existing = await Enrollment.findOne({ userId: session.user.id, courseId });
    if (!existing) {
      await Enrollment.create({
        userId: session.user.id,
        courseId,
        paymentId: payment._id,
      });
      await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    }

    return NextResponse.json({ success: true, data: { paymentId, enrolled: !existing } });
  } catch (err) {
    console.error('[POST /api/payments/razorpay/verify]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
