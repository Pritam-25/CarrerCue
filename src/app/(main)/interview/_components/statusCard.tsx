import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Assessment } from "@prisma/client";
import { Brain, Trophy } from "lucide-react";

export default function StatusCard({
  assessments,
}: {
  assessments: Assessment[];
}) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;

    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );

    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0]; // because we sort them in asc order
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.question.length,
      0
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Average Score Card */}
      <Card className="gap-2 rounded-xl shadow-sm hover:shadow-md hover:bg-muted/20 transition-all">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium tracking-wide">
            Average Score
          </CardTitle>
          <Trophy className="h-8 w-8 p-2 text-primary bg-primary/10 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold">
            {getAverageScore()}%
          </div>
          <p className="text-xs text-muted-foreground">
            Across all assessments
          </p>
        </CardContent>
      </Card>

      {/* Question Practice Card */}
      <Card className="gap-2 rounded-xl shadow-sm hover:shadow-md hover:bg-muted/20 transition-all">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium tracking-wide">
            Question Practice
          </CardTitle>
          <Brain className="h-8 w-8 p-2 text-primary bg-primary/10 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold">
            {getTotalQuestions()}
          </div>
          <p className="text-xs text-muted-foreground">Total questions</p>
        </CardContent>
      </Card>

      {/* Latest Score Card */}
      <Card className="gap-2 rounded-xl shadow-sm hover:shadow-md hover:bg-muted/20 transition-all">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium tracking-wide">
            Latest Score
          </CardTitle>
          <Trophy className="h-8 w-8 p-2 text-primary bg-primary/10 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold">
            {getLatestAssessment()?.quizScore.toFixed() || 0}%
          </div>
          <p className="text-xs text-muted-foreground">Most recent quiz</p>
        </CardContent>
      </Card>
    </div>
  );
}
