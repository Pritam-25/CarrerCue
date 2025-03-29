"use server"
import { authenticateUser } from "@/lib/authenticateUser";
import db from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { queryKeys } from "inngest";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export type Question = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
}

export type QuestionResult = {
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export async function generateQuiz() {
  const user = await authenticateUser();

  const prompt = `
    Generate 10 technical interview questions for a ${user.industry
    } professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    Don't generate same question again and again, generate new question every time, repetition should minimal.
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    // console.log("Quiz Data Received:", quiz.questions);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", (error as Error).message);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions: Question[], answers: string[], score: number) {
  const user = await authenticateUser();

  const questionsResults: QuestionResult[] = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],   //const answers = ["A", "C", "D", "B", "A", "C", "B", "D", "A", "C"];
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation
  }));



  // Get wrong answers
  const wrongAnswers = questionsResults.filter((q) => !q.isCorrect);


  // Only generate improvement tips if there are wrong answers


  let improvementTip = "";

  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers.map((q) =>
      `Question: "${q.question}"\nCorrect: Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
    ).join("\n\n");

    const improvementPrompt = `
        The user got the following ${user.industry} technical interview questions wrong:
        ${wrongQuestionsText}
        Based on these mistakes, provide a concise, specific improvement tip.
        Focus on the knowledge gaps revealed by these wrong answers.
        Keep the response under 2 sentences and make it encouraging.
        Don't explicitly mention the mistakes, instead focus on what to learn/practice.
      `;
    try {
      const result = await model.generateContent(improvementPrompt);
      const response = result.response;
      improvementTip = response.text().trim();

    } catch (error) {
      console.error("Error generating improvement tip:", (error as Error).message);
      // Continue without improvement tip if generation fails
    }
  }



  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        question: questionsResults,
        category: "Technical",
        improvementTip,
      }
    })
    return assessment
  } catch (error) {
    console.error("Error saving quiz result:", (error as Error).message);
    throw new Error("Failed to save quiz result");
  }
}


export async function getAssessments() {
  const user = await authenticateUser();

  try {
    const assessment = await db.assessment.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    return assessment;
  } catch (error) {
    console.error("Error fetching assessments:", (error as Error).message);
    throw new Error("Failed to fetch assessments");
  }
}
