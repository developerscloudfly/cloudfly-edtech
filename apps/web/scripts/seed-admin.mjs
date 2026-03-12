/**
 * Seed script — creates the admin user if it doesn't already exist.
 * Run: node apps/web/scripts/seed-admin.mjs
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI =
  'mongodb+srv://developerscloudfly_db_user:8oAmVXNEp0qRIenK@cloudflyedtech.momyhbe.mongodb.net/cloudfly-edtech?retryWrites=true&w=majority&appName=CloudFlyEdTech';

const UserSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    role:         { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    avatar:       { type: String },
    bio:          { type: String, maxlength: 500 },
    isVerified:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('Connected.');

  const email = 'admin@gmail.com';
  const existing = await User.findOne({ email }).select('+passwordHash');

  if (existing) {
    console.log(`Admin user already exists (role: ${existing.role}). Skipping.`);
  } else {
    const passwordHash = await bcrypt.hash('Admin@123', 12);
    await User.create({
      name: 'Admin',
      email,
      passwordHash,
      role: 'admin',
      isVerified: true,
    });
    console.log('✓ Admin user created: admin@gmail.com / Admin@123');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
