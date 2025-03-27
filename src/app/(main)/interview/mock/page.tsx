import Link from "next/link";
import Quiz from "../_components/quiz";
import { ApiRoute } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MockInterviewPage() {
  return (
    <div className="space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href={ApiRoute.INTERVIEW}>
          <Button variant={"link"} className="gap-2 pl-0">
            <ArrowLeft calcMode={"h-4 w-4"} />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-5xl font-black text-gradient">Mock Interview</h1>
          <p className="text-muted-foreground">
            Test your knowledge with industry-specific question
          </p>
        </div>
      </div>
      <Quiz/>
    </div>
  );
}
