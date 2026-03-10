import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import connectDB from '@/lib/db';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { courseId, userId } = session.metadata ?? {};

    if (!courseId || !userId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const payment = await Payment.create({
      userId,
      courseId,
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency?.toUpperCase() ?? 'USD',
      gateway: 'stripe',
      gatewayPaymentId: session.payment_intent as string,
      status: 'success',
    });

    const existing = await Enrollment.findOne({ userId, courseId });
    if (!existing) {
      await Enrollment.create({ userId, courseId, paymentId: payment._id });
      await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    }
  }

  return NextResponse.json({ received: true });
}
