import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IChatMessage extends Document {
  fromId: Types.ObjectId;
  toId: Types.ObjectId;
  courseId: Types.ObjectId;
  content: string;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    fromId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    content: { type: String, required: true, trim: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ fromId: 1, toId: 1 });
ChatMessageSchema.index({ courseId: 1 });
ChatMessageSchema.index({ createdAt: -1 });

const ChatMessage: Model<IChatMessage> =
  mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;
