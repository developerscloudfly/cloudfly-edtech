import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IForumReply {
  authorId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IForumPost extends Document {
  courseId: Types.ObjectId;
  authorId: Types.ObjectId;
  title: string;
  content: string;
  replies: IForumReply[];
  createdAt: Date;
  updatedAt: Date;
}

const ForumReplySchema = new Schema<IForumReply>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ForumPostSchema = new Schema<IForumPost>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    replies: [ForumReplySchema],
  },
  { timestamps: true }
);

ForumPostSchema.index({ courseId: 1, createdAt: -1 });
ForumPostSchema.index({ authorId: 1 });

const ForumPost: Model<IForumPost> =
  mongoose.models.ForumPost ||
  mongoose.model<IForumPost>('ForumPost', ForumPostSchema);

export default ForumPost;
