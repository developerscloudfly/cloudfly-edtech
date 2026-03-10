import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Payment from '@/models/Payment';
import { getStripeClient } from '@/lib/stripe';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Only successful payments can be refunded' },
        { status: 400 }
      );
    }

    if (payment.gateway === 'stripe') {
      await getStripeClient().refunds.create({ payment_intent: payment.gatewayPaymentId });
    }
    // Razorpay refund would require different API call

    payment.status = 'refunded';
    await payment.save();

    return NextResponse.json({ success: true, data: payment });
  } catch (err) {
    console.error('[POST /api/admin/payments/[id]/refund]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
