"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { onboardingFormData, onboardingSchema } from "@/app/lib/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { ApiRoute } from "@/constants/routes";
import { Loader } from "lucide-react";

interface Industries {
  id: string;
  name: string;
  subIndustries: string[];
}

interface OnboardingFormProps {
  industries: Industries[];
}

export default function OnboardingForm({ industries }: OnboardingFormProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industries | null>(
    null
  );
  const router = useRouter();

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updatedUserData,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<onboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values: onboardingFormData) => {
    const formattedIndustry = `${values.industry}-${values.subIndustry}`
      .toLowerCase()
      .replace(/ /g, "-");

    await updateUserFn({
      ...values,
      industry: formattedIndustry,
    });
  };

  useEffect(() => {
    if (updatedUserData?.success && !updateLoading) {
      toast.success("Profile update successfully");
      router.push(ApiRoute.DASHBOARD);
      router.refresh();
    }

    return () => {
      // second;
    };
  }, [updatedUserData, updateLoading]);

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gradient text-3xl font-bold">
            Complete your profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Industry Selection */}
            <div className="space-y-2">
              <Label className="text-primary/70" htmlFor="industry">
                Industry
              </Label>
              <Select
                onValueChange={(value) => {
                  const selected =
                    industries.find((ind) => ind.id === value) || null;
                  setSelectedIndustry(selected);
                  setValue("industry", value);
                  setValue("subIndustry", ""); // Reset subIndustry when industry changes
                }}
              >
                <SelectTrigger id="industry" className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem value={industry.id} key={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-red-500 text-sm">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Sub-Industry Selection */}
            {selectedIndustry && selectedIndustry.subIndustries.length > 0 && (
              <div className="space-y-2">
                <Label className="text-primary/70" htmlFor="subIndustry">
                  Specialization
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("subIndustry", value);
                  }}
                >
                  <SelectTrigger id="subIndustry" className="w-full">
                    <SelectValue placeholder="Select a sub-industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry.subIndustries.map((sub) => (
                      <SelectItem value={sub} key={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-red-500 text-sm">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <Label className="text-primary/70" htmlFor="experience">
                Years of Experience
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label className="text-primary/70" htmlFor="skills">
                Skills
              </Label>
              <Input
                id="skills"
                placeholder="Enter your skills"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-red-500 text-sm">{errors.skills.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-primary/70" htmlFor="bio">
                Professional Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                {...register("bio")}
                className="h-32"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
