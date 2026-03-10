import Stripe from 'stripe';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not defined');
  return new Stripe(key, { apiVersion: '2023-10-16' as never });
}

export async function createCheckoutSession({
  courseId,
  courseTitle,
  amount,
  currency = 'usd',
  userId,
  successUrl,
  cancelUrl,
}: {
  courseId: string;
  courseTitle: string;
  amount: number;
  currency?: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: courseTitle },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { courseId, userId },
  });
}

export function getStripeClient(): Stripe {
  return getStripe();
}
