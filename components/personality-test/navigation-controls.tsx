import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrinciplesData } from "@/lib/types";
import {
  personalityTestStore,
  Question,
} from "@/lib/store/personality-test-store";
import { useStore } from "zustand";
import { useAssessment } from "@/lib/store/assessment-sync";
import { z } from "zod";
import { QuestionSchema } from "@/lib/sheets-api";

export function NavigationControls({
  totalPages,
  // principlesData,
  questionPages,
  onSubmit,
}: {
  totalPages: number;
  // principlesData: PrinciplesData;
  questionPages: z.infer<typeof QuestionSchema>[][];
  onSubmit: () => void;
}) {
  const router = useRouter();
  const { setDirection } = useStore(personalityTestStore);
  const { data: assessment, setCurrentPage } = useAssessment();
  const currentPage = assessment.current_page;
  const isPageComplete = questionPages[currentPage].every(
    (q) => assessment.answers[q.id] > 0
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 200);
    } else {
      onSubmit();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 200);
    }
  };

  return (
    <div className="flex justify-between pt-2 pb-8">
      <Button
        variant="outline"
        onClick={goToPreviousPage}
        disabled={currentPage === 0}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Previous
      </Button>

      <Button
        onClick={goToNextPage}
        disabled={!isPageComplete}
        className="flex items-center gap-2"
      >
        {currentPage === totalPages - 1 ? "See Results" : "Next"}
        {currentPage < totalPages - 1 && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}
