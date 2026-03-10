import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  type: 'short' | 'long';
  price: number;
  isFree: boolean;
  freeModuleCount: number;
  instructorId: Types.ObjectId;
  thumbnail?: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  enrollmentCount: number;
  totalDuration: number;
  cohortStartDate?: Date;
  cohortEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['short', 'long'], required: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    isFree: { type: Boolean, default: false },
    freeModuleCount: { type: Number, default: 0, min: 0 },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnail: { type: String },
    tags: [{ type: String, trim: true }],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    enrollmentCount: { type: Number, default: 0, min: 0 },
    totalDuration: { type: Number, default: 0, min: 0 },
    cohortStartDate: { type: Date },
    cohortEndDate: { type: Date },
  },
  { timestamps: true }
);

// slug already indexed via unique:true in field def
CourseSchema.index({ instructorId: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ tags: 1 });

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
