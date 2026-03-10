import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ILiveSession extends Document {
  courseId: Types.ObjectId;
  instructorId: Types.ObjectId;
  title: string;
  livekitRoomName: string;
  scheduledAt: Date;
  status: 'scheduled' | 'live' | 'ended';
  recordingYoutubeId?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    livekitRoomName: { type: String, required: true, unique: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'ended'],
      default: 'scheduled',
    },
    recordingYoutubeId: { type: String },
    duration: { type: Number, min: 0 },
  },
  { timestamps: true }
);

LiveSessionSchema.index({ courseId: 1 });
LiveSessionSchema.index({ instructorId: 1 });
LiveSessionSchema.index({ status: 1 });

const LiveSession: Model<ILiveSession> =
  mongoose.models.LiveSession ||
  mongoose.model<ILiveSession>('LiveSession', LiveSessionSchema);

export default LiveSession;
