import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import QuizAttempt from '@/models/QuizAttempt';
import Enrollment from '@/models/Enrollment';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    const enrollment = await Enrollment.findOne({
      userId: session.user.id,
      courseId: quiz.courseId,
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Not enrolled' }, { status: 403 });
    }

    const { answers } = await req.json() as { answers: number[] };

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return NextResponse.json({ success: false, error: 'Invalid answers format' }, { status: 400 });
    }

    const correct = quiz.questions.filter((q, i) => answers[i] === q.correctIndex).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      userId: session.user.id,
      quizId: quiz._id,
      courseId: quiz.courseId,
      score,
      passed,
      answers,
    });

    return NextResponse.json({
      success: true,
      data: { score, passed, passingScore: quiz.passingScore, attemptId: attempt._id },
    });
  } catch (err) {
    console.error('[POST /api/quizzes/[id]/attempt]', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
