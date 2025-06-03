"use client";
import { Card, CardContent } from "@/components/ui/card";
import { dimensions } from "@/lib/questions";
import { AnimatePresence, motion } from "framer-motion";
import { PrinciplesData } from "@/lib/types";
import { QuestionDisplay } from "./personality-test/question-display";
import { ProgressBar } from "./personality-test/progress-bar";
import { NavigationControls } from "./personality-test/navigation-controls";
import { TestHeader } from "./personality-test/test-header";
import { PersonalityTestProvider } from "./personality-test/personality-test-context";
import {
  personalityTestStore,
  Question,
} from "@/lib/store/personality-test-store";
import { useStore } from "zustand";
import { useRouter } from "next/navigation";
import { getDimensionScores } from "@/utils/assessment/get-dimension-scores";
import { useAssessment } from "@/lib/store/assessment-sync";
import { useQuestions } from "@/lib/use-assessment-sheets";
import { z } from "zod";
import { QuestionSchema } from "@/lib/sheets-api";
import { useTest } from "@/app/assessment/getTest";
import { useAuth } from "./auth/context";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import ProfileDropdown from "@/components/ui/profile-dropdown";

// Sample data for preview
const getDummyData = () => {
  const dummyScores: Record<string, number> = {};

  dimensions.forEach((dimension) => {
    // Generate random scores between 40 and 80 for a balanced profile
    dummyScores[dimension] = Math.floor(Math.random() * 40) + 40;
  });

  return dummyScores;
};

function PersonalityTestInner({
  questionPages,
  totalPages,
  questionsPerPage,
  // principlesData,
  onSubmit,
}: {
  questionPages: z.infer<typeof QuestionSchema>[][];
  totalPages: number;
  questionsPerPage: number;
  // principlesData: PrinciplesData;
  onSubmit: () => void;
}) {
  const { data: assessment } = useAssessment();
  const currentPage = assessment.current_page;
  const direction = useStore(personalityTestStore, (state) => state.direction);
  const currentPageQuestions = questionPages[currentPage];

  if (questionPages.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 md:p-8 flex justify-center items-center min-h-[300px]">
            <p>Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ProgressBar
            totalPages={totalPages}
            questionsPerPage={questionsPerPage}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 md:p-8">
                <TestHeader totalPages={totalPages} />

                <div className="space-y-10">
                  {currentPageQuestions.map((question, questionIndex) => (
                    <QuestionDisplay
                      key={currentPage + questionIndex}
                      question={question}
                      questionIndex={questionIndex}
                      // questionPages={questionPages}
                      // currentPageQuestions={currentPageQuestions}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <NavigationControls
          totalPages={totalPages}
          // principlesData={principlesData}
          questionPages={questionPages}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export function PersonalityTest({}: // principlesData,
// questions,
// interlacedQuestions,
// totalPages = 10,
// questionsPerPage = 10,
{
  // principlesData: PrinciplesData; // server-side fetched
  // questions: z.infer<typeof QuestionSchema>[] | undefined;
  // interlacedQuestions: Question[][];
  // totalPages: number;
  // questionsPerPage: number;
}) {
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();

  const { data: testData, isLoading } = useTest();
  const { data: questions } = useQuestions();

  const { data: assessment, reset } = useAssessment(user?.id);
  const [showRetakePrompt, setShowRetakePrompt] = useState(false);
  const [allowRetake, setAllowRetake] = useState(false);

  // Redirect to signup if not logged in
  useEffect(() => {
    if (!loading && !user) {
      const callback = encodeURIComponent("/assessment");
      router.replace(`/signup?callback=${callback}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (
      isLoggedIn &&
      assessment &&
      Object.keys(assessment.answers || {}).length > 0 &&
      !allowRetake
    ) {
      toast({
        title: "Test Already Exists",
        description:
          "You already have test results. Would you like to retake the test?",
        action: (
          <button
            className="ml-4 px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              reset();
              setAllowRetake(true);
              toast({ title: "You can now retake the test." });
            }}
          >
            Retake
          </button>
        ),
      });
      setShowRetakePrompt(true);
    }
  }, [isLoggedIn, assessment, allowRetake, reset]);

  const handleSubmit = () => {
    const compactData = getDimensionScores(assessment?.answers, questions);
    const resultsPath =
      "/results?data=" + encodeURIComponent(btoa(JSON.stringify(compactData)));
    if (isLoggedIn) {
      router.push(resultsPath);
    } else {
      router.push(`signup?callback=` + encodeURIComponent(resultsPath));
      // TODO: Save the assessment to local storage
    }
    window.scrollTo(0, 0);
  };

  if (loading || !isLoggedIn) {
    return <main className="container mx-auto py-8 px-4">Loading...</main>;
  }

  if (showRetakePrompt && !allowRetake) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div>
          You already have test results. Check your{" "}
          <a href="/results" className="underline text-sky-11">
            results
          </a>{" "}
          or <span className="font-semibold">retake</span> from the notice
          above.
        </div>
      </main>
    );
  }

  const { interlacedQuestions, totalPages, questionsPerPage } = testData ?? {};

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="absolute top-4 right-4 z-10">
        <ProfileDropdown />
      </div>
      <PersonalityTestInner
        questionPages={interlacedQuestions}
        totalPages={totalPages}
        questionsPerPage={questionsPerPage}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
