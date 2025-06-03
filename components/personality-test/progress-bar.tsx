import { Progress } from "@/components/ui/progress";
import { useStore } from "zustand";
import { personalityTestStore } from "@/lib/store/personality-test-store";
import { useAssessment } from "@/lib/store/assessment-sync";
import { useQuestions } from "@/lib/use-assessment-sheets";

export function ProgressBar({
  totalPages,
  questionsPerPage,
}: {
  totalPages: number;
  questionsPerPage: number;
}) {
  const { data: questions } = useQuestions();
  const totalQuestions = questions?.length ?? 0;
  const { data: assessment } = useAssessment();
  const currentPage = assessment.current_page;
  const questionProgress =
    (Object.keys(assessment.answers).length / totalQuestions) * 100;

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
