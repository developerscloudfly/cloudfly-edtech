import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IModule extends Document {
  courseId: Types.ObjectId;
  title: string;
  order: number;
  isPreview: boolean;
}

const ModuleSchema = new Schema<IModule>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, min: 0 },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ModuleSchema.index({ courseId: 1, order: 1 });

const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);

export default Module;
