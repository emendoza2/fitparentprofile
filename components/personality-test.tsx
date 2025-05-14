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
  principlesData,
  onSubmit,
}: {
  questionPages: Question[][];
  totalPages: number;
  questionsPerPage: number;
  principlesData: PrinciplesData;
  onSubmit: () => void;
}) {
  const currentPage = useStore(
    personalityTestStore,
    (state) => state.currentPage
  );
  const direction = useStore(personalityTestStore, (state) => state.direction);
  const currentPageQuestions = useStore(personalityTestStore, (state) =>
    state.getCurrentPageQuestions({ questionPages })
  );

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
                  {currentPageQuestions.map((_, questionIndex) => (
                    <QuestionDisplay
                      key={currentPage + questionIndex}
                      questionIndex={questionIndex}
                      questionPages={questionPages}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <NavigationControls
          totalPages={totalPages}
          principlesData={principlesData}
          questionPages={questionPages}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export function PersonalityTest({
  principlesData,
  interlacedQuestions,
  totalPages = 10,
  questionsPerPage = 10,
}: {
  principlesData: PrinciplesData; // server-side fetched
  interlacedQuestions: Question[][];
  totalPages: number;
  questionsPerPage: number;
}) {
  const router = useRouter();
  const calculateCompactAnswers = useStore(
    personalityTestStore,
    (state) => state.calculateCompactAnswers
  );
  const handleSubmit = () => {
    const compactData = calculateCompactAnswers({ principlesData });

    router.push(
      "results?data=" + encodeURIComponent(btoa(JSON.stringify(compactData)))
    );
    window.scrollTo(0, 0);
  };
  return (
    <PersonalityTestInner
      questionPages={interlacedQuestions}
      totalPages={totalPages}
      questionsPerPage={questionsPerPage}
      principlesData={principlesData}
      onSubmit={handleSubmit}
    />
  );
}
