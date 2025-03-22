import { industries } from "@/data/industries";
import OnbaordingForm from "./_components/onboarding";

export default function OnboardingPage() {
  return <main>
    <OnbaordingForm industries={industries}/>
  </main>;
}
