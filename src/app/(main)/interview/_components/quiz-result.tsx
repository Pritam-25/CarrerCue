import { QuestionResult } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Assessment } from "@prisma/client";
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Trophy, XCircle } from "lucide-react";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}: {
  result: Assessment;
  hideStartNew?: boolean;
  onStartNew: () => void;
}) {
  if (!result) return null;

  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* Title */}
      <h1 className="flex items-center gap-2 text-3xl font-semibold text-gradient">
        <Trophy className="h-6 w-6 text-yellow-500" aria-label="Trophy Icon" />
        Quiz Results
      </h1>

      <CardContent>
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold">
            {result.quizScore.toFixed(1)} / 100
          </p>
          <Progress
            value={result.quizScore}
            max={100}
            className="w-full h-3 rounded-2xl"
          ></Progress>
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-4">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-gray-600 dark:text-gray-300">
              {result.improvementTip}
            </p>
          </div>
        )}

        {/* Question Review */}
        <div className="space-y-4 mt-6">
          <h3 className="font-medium text-lg">Question Review</h3>
          {Array.isArray(result.question) &&
            (result.question as QuestionResult[]).map((q, indx) => (
              <div key={indx} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{q.question}</p>
                  {q.isCorrect ? (
                    <CheckCircle2
                      className="h-5 w-5 text-green-500 flex-shrink-0"
                      aria-label="Correct Answer"
                    />
                  ) : (
                    <XCircle
                      className="h-5 w-5 text-red-500 flex-shrink-0"
                      aria-label="Incorrect Answer"
                    />
                  )}
                </div>

                {/* Answers */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Your Answer:</strong> {q.userAnswer}
                  </p>
                  {!q.isCorrect && (
                    <p>
                      <strong>Correct Answer:</strong> {q.answer}
                    </p>
                  )}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <p className="font-medium">Explanation:</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </CardContent>

      {/* Start New Quiz Button */}
      {!hideStartNew && (
        <CardFooter className="mt-10">
          <Button onClick={onStartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
