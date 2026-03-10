import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICertificate extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  shareableToken: string;
  issuedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    shareableToken: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });
CertificateSchema.index({ shareableToken: 1 });

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;
