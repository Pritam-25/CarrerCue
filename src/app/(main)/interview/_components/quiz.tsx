"use client";

import { generateQuiz, Question, saveQuizResult } from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import QuizResult from "./quiz-result";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  console.log("result after submitting: ", resultData);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswers = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setShowExplanation(false);
  };

  const handlePrevious = () => {
    setCurrentQuestion(currentQuestion - 1);
    setShowExplanation(false);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((ans, ind) => {
      if (ans === quizData[ind].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();

    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz Completed!");
    } catch (error) {
      toast.error("Failed to save quiz result");
      console.log(
        "Error in saving quiz result(client): ",
        (error as Error).message
      );
    }
  };

  //   if loading show bar loader
  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="blue" />;
  }

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(undefined);
  };

  //   show results if quiz is complete
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className=" text-muted-foreground">
            The quiz contains 10 questions specific to your industry and skills.
            Take your time and chose the best answers for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateQuizFn}
            variant={"outline"}
            className="w-full"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question: Question = quizData[currentQuestion];

  // Add safety checks for question options
  const options = question.options || [];

  return (
    <div className="mx-2 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary/80">
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{question.question}</p>

          <RadioGroup
            value={answers[currentQuestion] ?? undefined}
            onValueChange={handleAnswers}
          >
            {options.map((option: string, index: number) => {
              return (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label className="= w-full" htmlFor={`option-${index}`}>
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          {showExplanation && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">Explanation</p>
              <p className="text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!showExplanation && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant={"outline"}
              disabled={!answers[currentQuestion]}
            >
              Show Explanation
            </Button>
          )}

          <div className="ml-auto flex gap-4 ">
            <Button
              variant={"ghost"}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="block sm:flex"
              variant={"ghost"}
              disabled={currentQuestion === quizData.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <div className="flex justify-end">
        <Button
          disabled={savingResult || !(currentQuestion === quizData.length - 1)}
          onClick={finishQuiz}
        >
          {savingResult ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Results...
            </>
          ) : (
            <>Submit Answers</>
          )}
        </Button>
      </div>
    </div>
  );
}
