import Razorpay from 'razorpay';
import crypto from 'crypto';

function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay credentials are not defined');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function createRazorpayOrder({
  amount,
  currency = 'INR',
  courseId,
  userId,
}: {
  amount: number;
  currency?: string;
  courseId: string;
  userId: string;
}) {
  const razorpay = getRazorpay();
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    notes: { courseId, userId },
  });
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET is not defined');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}
