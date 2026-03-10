'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface MCQModalProps {
  questions: Question[];
  passingScore?: number;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export function MCQModal({ questions, passingScore = 80, onComplete, onClose }: MCQModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    const updated = [...selectedAnswers];
    updated[currentIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = questions.filter((q, i) => selectedAnswers[i] === q.correctIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passingScore;
    setShowResult(true);
    setTimeout(() => onComplete(score, passed), 2000);
  };

  const score = showResult
    ? Math.round(
        (questions.filter((q, i) => selectedAnswers[i] === q.correctIndex).length /
          questions.length) *
          100
      )
    : 0;
  const passed = score >= passingScore;

  if (showResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          {passed ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-blue-deep mb-2">Passed!</h2>
              <p className="text-slate mb-4">You scored {score}% — great job!</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-blue-deep mb-2">Not quite...</h2>
              <p className="text-slate mb-4">You scored {score}%. You need {passingScore}% to pass.</p>
            </>
          )}
          <Button onClick={onClose} className="w-full">Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl p-6 max-w-lg w-full mx-4">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-slate">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button onClick={onClose} className="text-slate hover:text-blue-deep text-sm">
            Close
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-ash rounded-full mb-6">
          <div
            className="h-full bg-blue-primary rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h3 className="font-heading font-semibold text-blue-deep text-lg mb-4">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors',
                selectedAnswer === i
                  ? 'border-blue-primary bg-blue-primary/10 text-blue-deep font-medium'
                  : 'border-ash hover:border-blue-primary hover:bg-bg-base text-slate'
              )}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          ))}
        </div>

        {/* Action */}
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
          className="w-full"
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </Button>
      </div>
    </div>
  );
}
