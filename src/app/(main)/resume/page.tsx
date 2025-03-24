import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

export default async function Page() {
//   const resume = await getResume();
  return (
    <div>
      <ResumeBuilder initialContent = {"resume"}/>
    </div>
  );
}
