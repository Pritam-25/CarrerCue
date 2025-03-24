"use server"

import { ApiRoute } from "@/constants/routes";
import { authenticateUser } from "@/lib/authenticateUser"
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


//* save resume 
export async function saveResume(content: any) {
    const user = await authenticateUser();

    try {
        // If the resume already exists, update its content; otherwise, create a new one
        const resume = await db.resume.upsert({
            where: {
                userId: user.id
            },
            update: {
                content
            },
            create: {
                userId: user.id,
                content
            }
        });

        revalidatePath(ApiRoute.RESUME);
    } catch (error) {
        console.error("Database Error: Failed to save or update the resume.", (error as Error).message);
        throw new Error("An error occurred while saving your resume. Please try again later.");
    }
}

//* get resume
export async function getResume() {
    const user = await authenticateUser();

    try {
        const resume = await db.resume.findUnique({
            where: {
                userId: user.id
            }
        });

        if (!resume) {
            throw new Error("No resume found for the current user.");
        }

        return resume;
    } catch (error) {
        console.error("Database Error: Failed to retrieve the resume.", (error as Error).message);
        throw new Error("Unable to fetch your resume at the moment. Please try again later.");
    }
}

//* improve resume with AI
//* improve resume with AI
export async function improveWithAi({ current, type }: { current: any; type: any }) {
    const user = await authenticateUser();

    const prompt = `As an expert resume writer, refine the following ${type} description for a ${user.industry} professional.  
    Enhance its impact by making it more results-driven, concise, and aligned with industry best practices.  

    ### Current Description:
    "${current}"

    ### Optimization Guidelines:
    - Start with strong action verbs to convey expertise.  
    - Incorporate quantifiable metrics and concrete results where applicable.  
    - Highlight key technical skills and industry-specific knowledge.  
    - Keep the description concise yet compelling.  
    - Emphasize achievements over responsibilities to showcase value.  
    - Integrate relevant keywords to enhance ATS optimization.  

    Deliver the improved description in a **single, well-structured paragraph** without any additional explanations or formatting notes.
    `;

    try {
        if (typeof model === "undefined") throw new Error("model is not available");

        const result = await model.generateContent(prompt);  // Ensure `await` is used for async operations
        const improvedContent = result.response.text().trim();

        return improvedContent;
    } catch (error) {
        console.error("AI Error: Failed to generate improved resume content.", (error as Error).message);
        throw new Error("There was an issue processing your request. Please try again later.");
    }
}


