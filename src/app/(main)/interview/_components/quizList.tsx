"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ApiRoute } from "@/constants/routes";
import { Assessment } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuizResult from "./quiz-result";

export default function QuizList({
  assessments,
}: {
  assessments: Assessment[];
}) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-gradient text-2xl md:text-3xl">
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review your pase quiz performance</CardDescription>
          </div>
          <Button onClick={() => router.push(ApiRoute.MOCK)}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment, indx) => {
              return (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedQuiz(assessment)}
                >
                  <CardHeader>
                    <CardTitle className="text-primary/80 tracking-wide">
                      Quiz {indx + 1}
                    </CardTitle>
                    <CardDescription className="flex justify-between w-full text-sm">
                      <div className="text-lg md:text-xl font-bold text-secondary-foreground">
                        Score: {assessment.quizScore.toFixed(1)}%
                      </div>
                      <div>
                        {format(
                          new Date(assessment.createdAt),
                          "MMMM dd, yyyy HH:mm"
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 pl-3 italic opacity-80">
                      {assessment.improvementTip}
                    </blockquote>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* dialog */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <QuizResult
              result={selectedQuiz}
              onStartNew={() => router.push(ApiRoute.MOCK)}
              hideStartNew
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
