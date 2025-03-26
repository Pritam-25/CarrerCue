import { z } from "zod";

export const onboardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry",
    }),
    subIndustry: z.string({
        required_error: "Please select a specialization",
    }),
    bio: z.string().max(500).optional(),
    experience: z
        .string({
            required_error: "Experience is required",
        })
        .trim()
        .min(1, "Experience is required") // Ensures input is not empty
        .transform((val) => {
            const num = Number(val);
            if (isNaN(num)) throw new Error("Experience must be a valid number");
            return num;
        })
        .pipe(
            z
                .number()
                .min(0, "Experience must be at least 0 years")
                .max(50, "Experience cannot exceed 50 years")
        ),
    skills: z.string().transform((val) =>
        val
            ? val
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : undefined
    ),
});

export type onboardingFormData = z.infer<typeof onboardingSchema>






