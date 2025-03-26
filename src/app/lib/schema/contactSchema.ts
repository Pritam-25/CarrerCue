import { z } from "zod";

export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional()
});

export type contactFormData = z.infer<typeof contactSchema>