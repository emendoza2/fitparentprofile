import { Progress } from "@/components/ui/progress";
import { useStore } from "zustand";
import { personalityTestStore } from "@/lib/store/personality-test-store";

export function ProgressBar({
  totalPages,
  questionsPerPage,
}: {
  totalPages: number;
  questionsPerPage: number;
}) {
  const currentPage = useStore(
    personalityTestStore,
    (state) => state.currentPage
  );
  const questionProgress = useStore(personalityTestStore, (state) =>
    state.getQuestionProgress({ totalPages, questionsPerPage })
  );

  return (
    <div className="space-y-2 flex-1">
      <div className="flex justify-between text-sm">
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <span>{Math.round(questionProgress)}% Complete</span>
      </div>
      <Progress value={questionProgress} className="h-2" />
    </div>
  );
}
