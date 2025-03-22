interface Industries {
    id: string;
    name: string;
    subIndustries: string[];
  }
  
  interface OnboardingFormProps {
    industries: Industries[]; 
  }
  
  export default function OnboardingForm({ industries }: OnboardingFormProps) {
    return <div></div>;
  }
  