import { industries } from "@/data/industries";
import OnbaordingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { ApiRoute } from "@/constants/routes";

export default async function OnboardingPage() {
  const { isOnboard } = (await getUserOnboardingStatus()) ?? {
    isOnboard: false,
  };

  if (isOnboard) {
    redirect(ApiRoute.DASHBOARD);
  }

  return (
    <main>
      <OnbaordingForm industries={industries} />
    </main>
  );
}
