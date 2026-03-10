import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ILesson extends Document {
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  type: 'video' | 'quiz' | 'live';
  youtubeVideoId?: string;
  duration: number;
  order: number;
  isPreview: boolean;
  liveSessionId?: Types.ObjectId;
}

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['video', 'quiz', 'live'], required: true },
    youtubeVideoId: { type: String },
    duration: { type: Number, default: 0, min: 0 },
    order: { type: Number, required: true, min: 0 },
    isPreview: { type: Boolean, default: false },
    liveSessionId: { type: Schema.Types.ObjectId, ref: 'LiveSession' },
  },
  { timestamps: true }
);

LessonSchema.index({ moduleId: 1, order: 1 });
LessonSchema.index({ courseId: 1 });

const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;
