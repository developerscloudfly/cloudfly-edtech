/**
 * ONE-TIME seed endpoint — creates the admin user on first deploy.
 * Protected by a secret token. DELETE THIS FILE after first use.
 * POST /api/seed  { "token": "<SEED_TOKEN>" }
 */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  const SEED_TOKEN = process.env.SEED_TOKEN;

  if (!SEED_TOKEN) {
    return NextResponse.json({ error: 'SEED_TOKEN not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.token !== SEED_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const email = 'admin@gmail.com';
  const existing = await User.findOne({ email });

  if (existing) {
    return NextResponse.json({ message: 'Admin already exists', role: existing.role });
  }

  const passwordHash = await bcrypt.hash('Admin@123', 12);
  await User.create({
    name: 'Admin',
    email,
    passwordHash,
    role: 'admin',
    isVerified: true,
  });

  return NextResponse.json({ message: 'Admin user created successfully' });
}
