"use client";

import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeFormData, resumeSchema } from "@/app/schema/resumeSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";

export default function ResumeBuilder({
  initialContent,
}: {
  initialContent: any;
}) {
  const [activeTab, setActiveTab] = useState<string>("edit");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<resumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const formValues = watch();

  const onsubmit = async () => {};

  // if initialcontent means resume is already present set tab to preview
  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  return (
    <div className=" space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold text-gradient text-3xl sm:text-4xl md:text-5xl">
          Resume Builder
        </h1>

        <div className="space-x-2 ">
          <Button variant={"destructive"}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size={"sm"} variant={"secondary"}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-8" onSubmit={handleSubmit(onsubmit)}>
            <div className="space-y-4">
              <h3 className=" text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols1 md:grid-cols-2 gap-4 px-4 py-8 border rounded-lg bg-card">
                <div className="space-y-4">
                  <Label
                    htmlFor="contactInfo.email"
                    className="text-sm font-medium text-primary/80"
                  >
                    Email 
                  </Label>

                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                  />
                  {errors?.contactInfo?.email && (
                    <p className="text-red-500 text-sm">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="contactInfo.mobile"
                    className="text-sm font-medium text-primary/80"
                  >
                    Mobile Number
                  </Label>

                  <Input
                    {...register("contactInfo.mobile")}
                    type="number"
                    placeholder="+1 234 567 8900"
                  />
                  {errors?.contactInfo?.mobile && (
                    <p className="text-red-500 text-sm">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="contactInfo.twitter"
                    className="text-sm font-medi text-primary/80"
                  >
                    Twitter/X Profile
                  </Label>

                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                  {errors?.contactInfo?.twitter && (
                    <p className="text-red-500 text-sm">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contactInfo.linkedin"
                    className="text-sm font-medium text-primary/80"
                  >
                    LinkedIn URL
                  </Label>

                  <Input
                    {...register("contactInfo.email")}
                    type="url"
                    placeholder="https://linkdin.com/in/your-profile"
                  />
                  {errors?.contactInfo?.linkedin && (
                    <p className="text-red-500 text-sm">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {/* GitHub Profile */}
                  <Label
                    htmlFor="contactInfo.github"
                    className="text-sm font-medi text-primary/80"
                  >
                    GitHub Profile
                  </Label>
                  <Input
                    {...register("contactInfo.github")}
                    type="url"
                    placeholder="https://github.com/your-username"
                  />
                  {errors?.contactInfo?.github && (
                    <p className="text-red-500 text-sm">
                      {errors.contactInfo.github.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Personal Portfolio */}
                  <Label
                    htmlFor="contactInfo.portfolio"
                    className="text-sm font-medi text-primary/80"
                  >
                    Personal Portfolio Website
                  </Label>
                  <Input
                    {...register("contactInfo.portfolio")}
                    type="url"
                    placeholder="https://yourportfolio.com"
                  />
                  {errors?.contactInfo?.portfolio && (
                    <p className="text-red-500 text-sm">
                      {errors.contactInfo.portfolio.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary.."
                  />
                )}
              />
              {errors?.summary && (
                <p className="text-red-500 text-sm">{errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your skills."
                  />
                )}
              />
              {errors?.skills && (
                <p className="text-red-500 text-sm">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.experience && (
                <p className="text-red-500 text-sm">
                  {errors.experience.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.education && (
                <p className="text-red-500 text-sm">
                  {errors.education.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Projects"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.projects && (
                <p className="text-red-500 text-sm">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
