import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface IQuiz extends Document {
  lessonId: Types.ObjectId;
  courseId: Types.ObjectId;
  questions: IQuizQuestion[];
  passingScore: number;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const QuizSchema = new Schema<IQuiz>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: [QuizQuestionSchema],
    passingScore: { type: Number, default: 80, min: 0, max: 100 },
  },
  { timestamps: true }
);

QuizSchema.index({ lessonId: 1 });
QuizSchema.index({ courseId: 1 });

const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz;
