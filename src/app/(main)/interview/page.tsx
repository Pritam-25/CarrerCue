import { getAssessments } from "@/actions/interview";
import StatusCard from "./_components/statusCard";
import PerformanceChart from "./_components/performanceChart";
import QuizList from "./_components/quizList";

export default async function InterviewPag() {
  const assessments = await getAssessments();

  return (
    <div>
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-10">
          Interview Preparation
        </h1>

        {/* Cards */}
        <div className="space-y-6">
          <StatusCard assessments={assessments} />
          <PerformanceChart assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      </div>
    </div>
  );
}
