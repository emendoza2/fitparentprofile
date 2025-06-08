"use client";
import { useTest } from "@/app/assessment/getTest";
import { Card, CardContent } from "@/components/ui/card";
import ProfileDropdown from "@/components/ui/profile-dropdown";
import { toast } from "@/hooks/use-toast";
import { QuestionSchema } from "@/lib/sheets-api";
import { useAssessment } from "@/lib/store/assessment-sync";
import { personalityTestStore } from "@/lib/store/personality-test-store";
import { useQuestions } from "@/lib/use-assessment-sheets";
import { getDimensionScores } from "@/utils/assessment/get-dimension-scores";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useStore } from "zustand";
import { useAuth } from "./auth/context";
import { NavigationControls } from "./personality-test/navigation-controls";
import { ProgressBar } from "./personality-test/progress-bar";
import { QuestionDisplay } from "./personality-test/question-display";
import { TestHeader } from "./personality-test/test-header";
import { useRequireLogin } from "@/hooks/use-require-login";

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

export function PersonalityTest() {
  const { user, isLoading: loading } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();

  const { data: testData, isLoading } = useTest();
  const { data: questions } = useQuestions();

  const { data: assessment, reset } = useAssessment(user?.id);
  const [showRetakePrompt, setShowRetakePrompt] = useState(false);
  const [allowRetake, setAllowRetake] = useState(false);

  useRequireLogin();

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
          or{" "}
          <button
            className="font-semibold hover:underline"
            onClick={() => {
              reset();
              setAllowRetake(true);
              toast({ title: "You can now retake the test." });
            }}
          >
            retake
          </button>
          .
        </div>
      </main>
    );
  }

  const { interlacedQuestions, totalPages, questionsPerPage } = testData ?? {};

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="flex  w-full justify-end mb-4">
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
