import { getUserOnboardingStatus } from "@/actions/user";
import { ApiRoute } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function IndustryInsightsPage() {

  const { isOnboard } = (await getUserOnboardingStatus()) ?? {
    isOnboard: false,
  };

  if(!isOnboard) redirect(ApiRoute.ONBOARDING)

  return <div>IndustryInsights Page</div>;
}
