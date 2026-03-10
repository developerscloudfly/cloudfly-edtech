import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IProjectSubmission extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  description: string;
  fileUrls: string[];
  status: 'pending' | 'reviewed';
  grade?: number;
  instructorFeedback?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

const ProjectSubmissionSchema = new Schema<IProjectSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fileUrls: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'reviewed'],
      default: 'pending',
    },
    grade: { type: Number, min: 0, max: 100 },
    instructorFeedback: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

ProjectSubmissionSchema.index({ userId: 1, courseId: 1 });
ProjectSubmissionSchema.index({ courseId: 1, status: 1 });

const ProjectSubmission: Model<IProjectSubmission> =
  mongoose.models.ProjectSubmission ||
  mongoose.model<IProjectSubmission>('ProjectSubmission', ProjectSubmissionSchema);

export default ProjectSubmission;
