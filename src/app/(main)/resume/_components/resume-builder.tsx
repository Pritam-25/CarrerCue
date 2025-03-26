"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, Download, Edit, Loader2, Monitor, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeFormData, resumeSchema } from "@/app/lib/schema/resumeSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { entriesToMarkdown } from "@/app/lib/helper";
import React from "react";
import html2pdf from "html2pdf.js";
import MDEditor from "@uiw/react-md-editor";
import {
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  Globe2Icon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export const resumeIcons = {
  // email: Mail,
  // mobile: Phone,
  // linkedin: Linkedin,
  // twitter: Twitter,
  // github: Github,
  // portfolio: Globe2Icon,
  email: "📧",
  mobile: "📱",
  linkedin: "🔗",
  twitter: "🐦",
  github: "💻",
  portfolio: "🌐",
};

export default function ResumeBuilder({
  initialContent,
}: {
  initialContent: string;
}) {
  // for changing the Form or Markdown
  const [activeTab, setActiveTab] = useState<string>("edit");

  // state for edit resume or preview resume button
  const [resumeMode, setResumeMode] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);

  // to show the resume preview
  const [previewContent, setPreviewContent] = useState<
    string | string[] | undefined
  >(initialContent);

  const { user } = useUser();

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

  const generatePdf = () =>{
    isGenerating(true)
    try {
      const element = document.getElementById("resume-pdf");

      const opt = {
        margin
      }

      await html2pdf().set(opt)
    } catch (error) {
      
    }
  }

  // if initialcontent means resume is already present set tab to preview
  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // render the markdown
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [activeTab, formValues, initialContent]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;

    const parts = [];
    if (contactInfo.email)
      parts.push(`${resumeIcons.email} ${contactInfo.email}`);
    if (contactInfo.mobile)
      parts.push(`${resumeIcons.mobile} ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`${resumeIcons.linkedin} ${contactInfo.linkedin}`);
    if (contactInfo.twitter)
      parts.push(`${resumeIcons.twitter} ${contactInfo.twitter}`);
    if (contactInfo.github)
      parts.push(`${resumeIcons.github} ${contactInfo.github}`);
    if (contactInfo.portfolio)
      parts.push(`${resumeIcons.portfolio} ${contactInfo.portfolio}`);

    return parts.length > 0
      ? `## <div align = "center">${user?.fullName}</div>
      \n\n <div align = "center">\n\n${parts.join(" | ")}\n\n</div>
    `
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  return (
    <div className=" space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold text-gradient text-4xl md:text-5xl ">
          Resume Builder
        </h1>

        <div className="space-x-2 ">
          <Button variant={"destructive"}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size={"sm"} variant={"secondary"} onClick={generatePdf}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-10">
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
                    name="contactInfo.email"
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
                    name="contactInfo.mobile"
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
                    name="contactInfo."
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
                    {...register("contactInfo.linkedin")}
                    type="url"
                    name="contactInfo.linkedin"
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
                    name="contactInfo.github"
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
                    name="contactInfo.portfolio"
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
        <TabsContent value="preview">
          <Button
            className="mb-2"
            variant={"link"}
            type="button"
            onClick={() =>
              setResumeMode(resumeMode === "preview" ? "edit" : "preview")
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Resume
              </>
            )}
          </Button>

          {resumeMode !== "preview" && (
            <Alert variant={"destructive"}>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>
                You will lose edited markdown if you update the from data
              </AlertTitle>
            </Alert>
          )}

          {/* preview resume */}
          <div className="border rounded-lg">
            <MDEditor
              value={
                Array.isArray(previewContent)
                  ? previewContent.join("\n")
                  : previewContent
              }
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode as "edit" | "preview" | undefined}
            />
          </div>

          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={
                  Array.isArray(previewContent)
                    ? previewContent.join("\n")
                    : previewContent
                }
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
